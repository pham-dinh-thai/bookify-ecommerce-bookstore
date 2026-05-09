import { Genre } from './genre.aggregate';
import { EmptyGenreIdException } from './exceptions/empty-genre-id.exception';
import { EmptyGenreNameException } from './exceptions/empty-genre-name.exception';

describe('Genre aggregate', () => {
  it('should create a genre when id and name are valid', () => {
    const genre = Genre.create('genre-1', 'Science Fiction');

    expect(genre).toBeInstanceOf(Genre);
    expect(genre.getId()).toBe('genre-1');
    expect(genre.getName()).toBe('Science Fiction');
  });

  it('should throw EmptyGenreIdException when id is empty', () => {
    expect(() => Genre.create('', 'Science Fiction')).toThrow(
      EmptyGenreIdException,
    );
  });

  it('should throw EmptyGenreNameException when name is empty', () => {
    expect(() => Genre.create('genre-1', '')).toThrow(EmptyGenreNameException);
  });

  it('should create a genre from persistent state without validation', () => {
    const genre = Genre.fromPersistent('genre-2', 'Fantasy');

    expect(genre).toBeInstanceOf(Genre);
    expect(genre.getId()).toBe('genre-2');
    expect(genre.getName()).toBe('Fantasy');
  });

  it('should rename the genre when the new name differs', () => {
    const genre = Genre.create('genre-3', 'Romance');

    const result = genre.rename('Historical Romance');

    expect(result).toEqual({
      oldName: 'Romance',
      newName: 'Historical Romance',
    });
    expect(genre.getName()).toBe('Historical Romance');
  });

  it('should preserve the same name when rename is called with the current name', () => {
    const genre = Genre.create('genre-4', 'Mystery');

    const result = genre.rename('Mystery');

    expect(result).toEqual({
      oldName: 'Mystery',
      newName: 'Mystery',
    });
    expect(genre.getName()).toBe('Mystery');
  });
});
