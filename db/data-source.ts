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
import 'dotenv/config';


// const path = require('path')
/**load env var */
// const envPath = path.resolve(__dirname, `.env.${process.env.NODE_ENV}`);
// console.log(envPath);
// require('dotenv').config({path: envPath});
require('dotenv').config();


export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      host: configService.get<string>('dbHost'),
      port: configService.get<number>('dbPort'),
      username: configService.get<string>('username'),
      database: configService.get<string>('dbName'),
      password: configService.get<string>('password') as string,
      // entities: ['dist/**/*.entity.js'],
      entities: [User, Artist, Song, Playlist],
      synchronize: false,
      migrations: ['dist/db/migrations/*.js'],
    };
  },
};


export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.USERNAME,
  database: process.env.DB_NAME,
  password: process.env.PASSWORD,
  entities: ['dist/**/*.entity.js'], 
  synchronize: false, 
  migrations: ['dist/db/migrations/*.js'], 
};

const dataSource = new DataSource(dataSourceOptions); 
export default dataSource;