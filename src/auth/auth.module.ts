import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { authConstants } from './auth.constants';
import { JwtStrategyy } from './jwt-strategy';
import { ArtistsModule } from 'src/artists/artists.module';
import { ApiKeyStrategy } from './api-key-strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule, 
    // JwtModule.register({
    //   secret: authConstants.secret, 
    //   signOptions: {
    //     expiresIn:'1d',
    //   },
    // }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('secret'),
        signOptions: {
          expiresIn: '1d',
        }
      }),
      inject: [ConfigService],
    }),
    ArtistsModule,
  ],
  providers: [AuthService, JwtStrategyy, ApiKeyStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
