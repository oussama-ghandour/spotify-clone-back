import { Artist } from "src/artists/artist.entity";
import { Playlist } from "src/playlists/playlist.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm"

@Entity('songs')
export class Song {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;


    @Column('date')
    releaseDate: Date;

    @Column('time')
    duration: Date;

    @Column('text')
    lyrics: string;

   

    @ManyToMany(() => Artist, (artist) => artist.songs, {cascade: true})
    @JoinTable({name: 'songs_artists'})
    artists: Artist[];

    @ManyToOne(() => Playlist, (playlist) => playlist.songs)
    playList: Playlist
}