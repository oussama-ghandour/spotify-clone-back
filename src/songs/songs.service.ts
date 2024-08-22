import { Injectable, Scope } from '@nestjs/common';
import { Song } from './song.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateSongDTO } from './dto/create-song-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDto } from './dto/update-song-dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Artist } from '../artists/artist.entity';


@Injectable({
    scope: Scope.TRANSIENT,
})
export class SongsService {

    constructor(
        @InjectRepository(Song)
        private songsRepository: Repository<Song>,
        @InjectRepository(Artist)
        private artistRepository: Repository<Artist>,
    ) {}
    //local db
    private readonly songs = [];

    async create(songDTO: CreateSongDTO) : Promise<Song> {
        const song =  new Song();
        song.title =  songDTO.title;
        song.artists =  songDTO.artists;
        song.duration =  songDTO.duration;
        song.releaseDate =  songDTO.releaseDate;
        song.lyrics = songDTO.lyrics;
        song.artists =  songDTO.artists;
        // find based on ids
        const artists =  await this.artistRepository.findByIds(songDTO.artists)
        // set the relation
        song.artists = artists;
        return await this.songsRepository.save(song);
        
    }

    //save in db
    // create(song) {
      
    //     this.songs.push(song);
    //     return this.songs;
    // }
    async findAll(): Promise<Song[]> {
        return await this.songsRepository.find();
    }

    async findOne(id: number): Promise<Song> {
        return await this.songsRepository.findOneBy({id});
    }

    async remove(id: number): Promise<DeleteResult> {
       return await this.songsRepository.delete(id);
    }

    async update(id: number, recordToUpdate: UpdateSongDto): Promise<UpdateResult> {
        return await this.songsRepository.update(id, recordToUpdate);
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
        //add query builder
        const queryBuilder = this.songsRepository.createQueryBuilder('c');
        queryBuilder.orderBy('c.releaseDate', 'DESC');
        return paginate<Song>(queryBuilder, options);
    }
}
