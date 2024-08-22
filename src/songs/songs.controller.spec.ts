import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDto } from './dto/update-song-dto';
import { Connection } from 'src/common/constants/connextion';


describe('SongsController', () => {
  let controller: SongsController;
  let service: SongsService;
  let mockConnection: Connection;

  beforeEach(async () => {
    mockConnection = { CONNECTION_STRING: 'mock-connection-string' } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        {
          provide: SongsService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: 'a uuid', title: 'Runaway' }),
            findAll: jest.fn().mockResolvedValue({
              items: [{ id: 1, title: 'Dancing Feat' }],
              meta: { totalItems: 1, itemCount: 1, itemsPerPage: 10, totalPages: 1, currentPage: 1 }
            }),
            findOne: jest.fn().mockResolvedValue({ id: 1, title: 'Dancing' }),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            remove: jest.fn().mockResolvedValue({ affected: 1 }),
            paginate: jest.fn().mockResolvedValue({
              items: [{ id: 1, title: 'Dancing Feat' }],
              meta: { totalItems: 1, itemCount: 1, itemsPerPage: 10, totalPages: 1, currentPage: 1 }
            })
          }
        },
        {
          provide: 'CONNECTION',
          useValue: mockConnection
        }
      ]
    }).compile();

    controller = await module.resolve<SongsController>(SongsController);
    service = await module.resolve<SongsService>(SongsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new song', async () => {
      const newSongDTO: CreateSongDTO = {
        title: 'Runaway',
        artists: undefined,
        releaseDate: undefined,
        duration: undefined,
        lyrics: ''
      };
      const result = await controller.create(newSongDTO, {} as any);
      expect(result).toEqual({ id: 'a uuid', title: 'Runaway' });
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of songs', async () => {
      const result = await controller.findAll(1, 10);
      expect(result).toEqual({
        items: [{ id: 1, title: 'Dancing Feat' }],
        meta: { totalItems: 1, itemCount: 1, itemsPerPage: 10, totalPages: 1, currentPage: 1 }
      });
    });
  });

  describe('findOne', () => {
    it('should return a song by id', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual({ id: 1, title: 'Dancing' });
    });
  });

  describe('update', () => {
    it('should update a song and return the result', async () => {
      const updateDTO: UpdateSongDto = {
        title: 'Animals',
        artists: undefined,
        releaseDate: undefined,
        duration: undefined,
        lyrics: ''
      };
      const result = await controller.update(1, updateDTO);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('delete', () => {
    it('should delete a song and return the result', async () => {
      const result = await controller.delete(1);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
