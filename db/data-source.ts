import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Artist } from 'src/artists/artist.entity';
import { Playlist } from 'src/playlists/playlist.entity';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
// import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
// const envPath = path.resolve(__dirname, `../.env.${process.env.NODE_ENV || 'development'}`);
// const envPath = path.resolve(__dirname, `../.env`);
// console.log('Loading .env file from:', envPath);
// dotenv.config({ path: envPath });
dotenv.config()

// Log environment variables to verify they are loaded
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_PORT:', process.env.DB_PORT);
// console.log('USERNAME:', process.env.USERNAME);
// console.log('DB_NAME:', process.env.DB_NAME);
// console.log('PASSWORD:', process.env.PASSWORD); 
// console.log('db:', process.env.DATABASE_URL);
// TypeORM configuration using ConfigService
export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    return {
      type: 'postgres',
      url: databaseUrl, 
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('USERNAME'),
      database: configService.get<string>('DB_NAME'),
      password: configService.get<string>('PASSWORD') as string,
      entities: [User, Artist, Song, Playlist],
      synchronize: false,
      migrations: ['dist/db/migrations/*.js'],
    };
  },
};

// DataSource configuration
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.USERNAME,
  database: process.env.DB_NAME,
  password: process.env.PASSWORD as string,
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
