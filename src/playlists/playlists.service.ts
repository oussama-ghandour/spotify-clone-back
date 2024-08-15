import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { privateDecrypt } from 'crypto';
import { Repository } from 'typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { CreatePlayListDto } from './dto/create-playlist.dto';

@Injectable()
export class PlaylistsService {
    constructor(
        @InjectRepository(Playlist)
        private playListRepo: Repository<Playlist>,

        @InjectRepository(Song)
        private songstRepo: Repository<Song>,

        @InjectRepository(User)
        private usertRepo: Repository<User>,
    ) {}

    async create(playListDTO: CreatePlayListDto): Promise<Playlist> {
        const playList = new Playlist();
        playList.name =  playListDTO.name;

        const songs = await this.songstRepo.findByIds(playListDTO.songs);
        playList.songs =  songs;

        const user = await this.usertRepo.findOneBy({id: playListDTO.user});
        playList.user = user;

        return this.playListRepo.save(playList);
    }
}

