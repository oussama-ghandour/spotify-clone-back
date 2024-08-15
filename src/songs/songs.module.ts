import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { connection } from 'src/common/constants/connextion';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { Artist } from 'src/artists/artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist])],
  controllers: [SongsController],
  providers: [
    //songservice
    // {
    //     provide: SongsService,
    //     useClass: SongsService,
    // },
    SongsService,
    {
        provide: 'CONNECTION',
        useValue: connection,
    }
  ],
})
export class SongsModule {}
