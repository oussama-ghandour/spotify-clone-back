import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Inject, Param, ParseIntPipe, Post, Put, Query, Request, Scope, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { Connection } from 'src/common/constants/connextion';
import { Song } from './song.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateSongDto } from './dto/update-song-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ArtistJwtGuard } from '../auth/artists-jwt-guard';
import { ApiTags } from '@nestjs/swagger';

@Controller({path: 'songs', scope: Scope.REQUEST})
@ApiTags('songs')
export class SongsController {
    [x: string]: any;
    constructor(
        private songsService: SongsService,
        @Inject('CONNECTION')
        private connection: Connection,
    ) {
        console.log(`This connection string ${this.connection.CONNECTION_STRING}`);
    }
    @Post()
    @UseGuards(ArtistJwtGuard)
    create(
        @Body() CreateSongDTO: CreateSongDTO,
        @Request()
        request
    ): Promise<Song> {
        return this.songsService.create(CreateSongDTO);
    }

    @Get()
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
        limit = 10,
    ): Promise<Pagination<Song>> {
        limit = limit > 100 ? 100 : limit;
        try {
            return this.songsService.paginate({
                page,
                limit,
            });
        } catch (e) {
            throw new HttpException(
                'server error',
                HttpStatus.INTERNAL_SERVER_ERROR,
                {
                    cause: e,
            
                },
            );
        }
      
    }
    // @Get()
    // findAll(): Promise<Song[]> {
    //     try {
    //         return this.songsService.findAll();
    //     } catch (e) {
    //         throw new HttpException(
    //             'server error',
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //             {
    //                 cause: e,
    //             },
    //         );
    //     }
       
    // }
 
    @Get(':id')
    findOne(
        @Param(
            'id',
            new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE}),
        )
        id: number
    ) : Promise<Song>{
        return this.songsService.findOne(id);
    }
    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSongDTO: UpdateSongDto
    ) : Promise<UpdateResult>{
        return this.songsService.update(id, updateSongDTO);
       
    }
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return this.songsService.remove(id);
    }
}
