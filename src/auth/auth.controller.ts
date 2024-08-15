import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-guard';
import { Enable2FAType } from './types';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private userService: UsersService,
        private authService: AuthService,
    ) {}
    @Post('signup')
    @ApiOperation({summary: "Register new user"})
    @ApiResponse({
        status: 201,
        description: 'It will return the user in the response',
    })
    signup(
        @Body()
        userDTO: CreateUserDTO,
    ) : Promise<User> {
        return this.userService.create(userDTO);
    }

    @Post('login')
    @ApiOperation({summary: 'login user'})
    @ApiResponse({
        status: 200,
        description: 'It will give acces_token in response',
    })
    login(
        @Body()
        loginDTO: LoginDTO,
    ) {
        return this.authService.login(loginDTO);
    }
    

    //for enable 2FA
    @Get('enable-2fa')
    @UseGuards(JwtAuthGuard)
    enable2FA(
        @Request()
        req,
    ): Promise<Enable2FAType> {
        console.log(req.user);
        return this.authService.enable2FA(req.user.userId);
    }

    //validate 2FA
    @Post('validate-2fa')
    @UseGuards(JwtAuthGuard)
    validate2FA(
        @Request()
        req,
        @Body()
        ValidateTokenDTO: ValidateTokenDTO,
    ): Promise<{ verified:  boolean}> {
        return this.authService.validate2FAToken(
            req.user.userId,
            ValidateTokenDTO.token,
        );
    }

    //disable 2FA
    @Get('disable-2fa')
    @UseGuards(JwtAuthGuard)
    disable2FA(
        @Request()
        req,
    ): Promise<UpdateResult> {
        return this.authService.disable2FA(req.user.userId);
    }

    //auth with apikey
    @Get('profile')
    @UseGuards(AuthGuard('bearer'))
    getProfile(
        @Request()
        req,
    ) {
        delete req.user.password;
        return {
            msg: "auth with api success",
            user: req.user,
        };
    }
    // test env
    @Get('test')
    testEnvVariable() {
        return this.authService.getEnvVariable(); 
    }
}
