import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { User } from 'src/users/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { Enable2FAType, PayloadType } from './types';
import * as speakeasy from 'speakeasy';
import { UpdateResult } from 'typeorm';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private artistService: ArtistsService,
        private configService: ConfigService,
    ) {}

    async login(loginDTO: LoginDTO): Promise<{accessToken: string} | {validate2FA: string; message: string}> {
        const user = await this.userService.findOne(loginDTO);
    
        const passwordMatched =  await bcrypt.compare(
            loginDTO.password,
            user.password,
        );

        if(passwordMatched) {
            delete user.password;
            const payload : PayloadType = {email: user.email, userId: user.id};
            const artist =  await this.artistService.findArtist(user.id);
            if (artist) {
                payload.artistId = artist.id;
            }
            //if user has 2FA
            if(user.enable2FA && user.twoFASecret) {
                return {
                    validate2FA: 'http://localhost:3000/auth/validate-2fa',
                    message:
                    'Please send token from authen app',
                };
            }
            return {
                accessToken: this.jwtService.sign(payload),
            };
        } else {
            throw new UnauthorizedException('Password does not match');
        }
    }

    // for method 2FA(authen)
    async enable2FA(userId:number): Promise<Enable2FAType> {
        const user = await this.userService.findById(userId);
        if(user.enable2FA) {
            return { secret: user.twoFASecret};
        }

        const secret =  speakeasy.generateSecret();
        console.log(secret);
        user.twoFASecret = secret.base32;
        await this.userService.updateSecretKey(user.id, user.twoFASecret);
        return { secret: user.twoFASecret};
    }

    //method to validate 2FA
    async validate2FAToken(
        userId: number,
        token:string,
    ): Promise<{ verified: boolean}> {
        try {
            const user =  await this.userService.findById(userId);

               //extract 2FA and verif secret
            const verified =  speakeasy.totp.verify({
            secret: user.twoFASecret,
            token: token,
            encoding:'base32'
            });
            if(verified) {
                return { verified:true};
            } else {
                return {verified: false};
            }
        } catch(err) {
        throw new UnauthorizedException('Error verif token');
        }
    }

    //disable 2FA
    async disable2FA(userId: number): Promise<UpdateResult> {
        return this.userService.disable2FA(userId);
    }

    //validation user apikey
    async validateUserByApiKey(apiKey: string): Promise<User> {
        return this.userService.findByApiKey(apiKey);
    }

    //env var
    getEnvVariable() {
        return this.configService.get<number>('port');
    }

}

