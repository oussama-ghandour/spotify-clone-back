import { Song } from "src/songs/song.entity";
import { User } from "src/users/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, ManyToOne } from "typeorm"

@Entity('playlists')
export class Playlist {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @OneToMany(() => Song,(song) => song.playList)
    songs: Song[];

    @ManyToOne(() => User, (user) => user.playLists)
    user: User;
}