import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SongsService } from './songs.service';
import { Song } from './song.entity';
import { Artist } from '../artists/artist.entity';
import { CreateSongDTO } from './dto/create-song-dto';


describe('SongsService', () => {
  let service: SongsService;
  let songRepo: Repository<Song>;
  let artistRepo: Repository<Artist>;

  const oneSong = {
    id: 1,
    title: 'test',
    artists: [{ id: 1, name: 'Artist Name' }],
    releaseDate: new Date(),
    lyrics: 'Some lyrics',
  };

  const songArray = [oneSong];
  const artistArray = [{ id: 1, name: 'Artist Name' }];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: getRepositoryToken(Song),
          useValue: {
            find: jest.fn().mockResolvedValue(songArray),
            findOne: jest.fn().mockResolvedValue(oneSong), 
            save: jest.fn().mockResolvedValue(oneSong),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            createQueryBuilder: jest.fn().mockReturnValue({
              orderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(songArray),
            }),
          },
        },
        {
          provide: getRepositoryToken(Artist),
          useValue: {
            findByIds: jest.fn().mockResolvedValue(artistArray),
          },
        },
      ],
    }).compile();

    service = await module.resolve<SongsService>(SongsService);
    songRepo = await module.resolve<Repository<Song>>(getRepositoryToken(Song));
    artistRepo = await module.resolve<Repository<Artist>>(getRepositoryToken(Artist));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should give me the song by id', async () => {
  //   const song = await service.findOne(1);
  //   expect(song).toEqual(oneSong);
  //   expect(songRepo.findOne).toBeCalledWith({ where: { id: 1 } });
  // });



  it('should create the song', async () => {
    const createSongDTO: CreateSongDTO = {
      title: 'test',
      artists: [1],
      releaseDate: new Date(),
      duration: undefined,
      lyrics: 'Some lyrics',
    };

    const song = await service.create(createSongDTO);

    expect(song).toEqual(oneSong);
    expect(songRepo.save).toBeCalledTimes(1);
    expect(songRepo.save).toBeCalledWith(expect.objectContaining({
      title: 'test',
      artists: expect.any(Array),
      releaseDate: expect.any(Date),
      lyrics: 'Some lyrics',
    }));
  });

  it('should update the song', async () => {
    const result = await service.update(1, {
      title: 'Updated title',
      artists: undefined,
      releaseDate: undefined,
      duration: undefined,
      lyrics: '',
    });
    expect(result.affected).toEqual(1);
    expect(songRepo.update).toBeCalledWith(1, {
      title: 'Updated title',
      artists: undefined,
      releaseDate: undefined,
      duration: undefined,
      lyrics: '',
    });
  });

  it('should delete the song', async () => {
    const result = await service.remove(1);
    expect(result.affected).toEqual(1);
    expect(songRepo.delete).toBeCalledWith(1);
  });
});

