import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Playlist } from "src/playlists/playlist.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: "testu",
        description: 'provide firstName user',
    })
    @Column()
    firstName: string;

    @ApiProperty({
        example: "hellu",
        description: 'provide lastName user',
    })
    @Column()
    lastName: string;

    @ApiProperty({
        example: 'testu@gmail.com',
        description: "provide email of user"
    })
    @Column({ unique: true})
    email: string;

    @ApiProperty({ 
        description: "provide password of user",
    })
    @Column()
    @Exclude()
    password: string;

    @Column({ nullable: true, type:'text'})
    twoFASecret: string;

    @Column({ default: false, type: 'boolean'})
    enable2FA: boolean;

    @Column()
    apiKey: string;




    /**A user can create many playlists */
    @OneToMany(() => Playlist, (playList) => playList.user)
    playLists: Playlist[];
}