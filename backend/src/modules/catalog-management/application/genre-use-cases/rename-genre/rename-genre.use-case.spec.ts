import { ICacheRepository } from '../../../../../shared/cache/domain/cache.repository.interface';
import { IUnitOfWork } from '../../../../../shared/unit-of-work/application/unit-of-work';
import { IAuditLogCommandRepository } from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import { Genre } from '../../../domain/genre-aggregate/genre.aggregate';
import { IGenresCommandRepository } from '../../../domain/genre-aggregate/repositories/genres-command.repository.interface';
import { RenameGenreUseCase } from './rename-genre.use-case';

describe('RenameGenreUseCase', () => {
  let renameGenreUseCase: RenameGenreUseCase;
  let mockGenresCommandRepository: jest.Mocked<IGenresCommandRepository>;
  let mockAuditLogCommandRepository: jest.Mocked<IAuditLogCommandRepository>;
  let mockUnitOfWork: jest.Mocked<IUnitOfWork>;
  let mockCacheRepository: jest.Mocked<ICacheRepository>;

  beforeEach(() => {
    mockGenresCommandRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    mockAuditLogCommandRepository = {
      write: jest.fn(),
    };

    mockUnitOfWork = {
      execute: jest.fn().mockImplementation((fn) => fn()),
    };

    mockCacheRepository = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      delByPattern: jest.fn(),
    };

    renameGenreUseCase = new RenameGenreUseCase(
      mockGenresCommandRepository,
      mockAuditLogCommandRepository,
      mockUnitOfWork,
      mockCacheRepository,
    );
  });

  it('should rename genre and invalidate cache', async () => {
    const genre = Genre.create('genre-1', 'Old Name');
    mockGenresCommandRepository.findOne.mockResolvedValue(genre);

    await renameGenreUseCase.execute('genre-1', { name: 'New Name' }, 'user-1');

    expect(mockGenresCommandRepository.save).toHaveBeenCalledWith(genre);
    expect(mockAuditLogCommandRepository.write).toHaveBeenCalledWith(
      'RENAME_GENRE',
      'user-1',
      'genre-management',
      'genres',
      expect.objectContaining({
        genreOldName: 'Old Name',
        genreNewName: 'New Name',
      }),
    );
    expect(mockCacheRepository.delByPattern).toHaveBeenCalledWith('genres:*');
  });

  it('Should do nothing when old name and new name is the same', async () => {
    const genre = Genre.create('genre-1', 'Same Name');
    mockGenresCommandRepository.findOne.mockResolvedValue(genre);

    await renameGenreUseCase.execute(
      'genre-1',
      { name: 'Same Name' },
      'user-1',
    );

    expect(mockGenresCommandRepository.save).not.toHaveBeenCalled();
    expect(mockAuditLogCommandRepository.write).not.toHaveBeenCalled();
    expect(mockCacheRepository.delByPattern).not.toHaveBeenCalled();
  });
});
