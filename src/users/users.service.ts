import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(userDTO: CreateUserDTO): Promise<User> {
        // create user
        const user = new User();
        user.firstName = userDTO.firstName;
        user.lastName = userDTO.lastName;
        user.email = userDTO.email;
        user.apiKey = uuidv4();

        
        const salt = await bcrypt.genSalt();
        user.password =  await bcrypt.hash(userDTO.password, salt);
        
        //save new user
        const savedUser = await this.userRepository.save(user);
        delete savedUser.password;
        return savedUser;
    }

    async findOne(data: LoginDTO): Promise<User> {
        const user = await this.userRepository.findOneBy({email: data.email});
        if(!user) {
            throw new UnauthorizedException('Could not login');
        }
        return user;
    }

    //find user by id
    async findById(id: number): Promise<User> {
        return this.userRepository.findOneBy({id: id});
    }

    //update key for 2FA
    async updateSecretKey(userId, secret:string):Promise<UpdateResult>{
        return this.userRepository.update(
            {id: userId},
            {
                twoFASecret: secret,
                enable2FA: true,
            },
        );
    }

    //disable 2FA
    async disable2FA(userId: number): Promise<UpdateResult> {
        return this.userRepository.update(
            {id: userId},
            {
                enable2FA: false,
                twoFASecret: null,
            },
        );
    }

    //apikey validation
    async findByApiKey(apiKey: string): Promise<User> {
        return this.userRepository.findOneBy({ apiKey});
    }
}
