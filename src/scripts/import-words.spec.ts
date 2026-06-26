import AppDataSource from '../infrastructure/db/data-source';
import {
  chunkWords,
  extractWords,
  importWordsFromDictionary,
} from './import-words';

jest.mock('../infrastructure/db/data-source', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    destroy: jest.fn(),
    createQueryRunner: jest.fn(),
  },
}));

describe('import-words script helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('extracts words from dictionary object', () => {
    expect(extractWords({ fire: 1, water: 1 })).toEqual(['fire', 'water']);
  });

  it('chunks words by batch size', () => {
    expect(chunkWords(['a', 'b', 'c', 'd', 'e'], 2)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
      ['e'],
    ]);
  });

  it('imports small dictionary and ignores duplicates', async () => {
    const insertedWords = new Set<string>();
    let currentValues: { word: string; data: { word: string } }[] = [];
    const builder = {
      insert: jest.fn(),
      into: jest.fn(),
      values: jest.fn(),
      orIgnore: jest.fn(),
      execute: jest.fn(),
    };

    builder.insert.mockReturnValue(builder);
    builder.into.mockReturnValue(builder);
    builder.values.mockImplementation((values) => {
      currentValues = values;
      return builder;
    });
    builder.orIgnore.mockReturnValue(builder);
    builder.execute.mockImplementation(async () => {
      const newWords = currentValues
        .map((item) => item.word)
        .filter((word) => !insertedWords.has(word));

      newWords.forEach((word) => insertedWords.add(word));

      return {
        identifiers: newWords.map((word) => ({ word })),
      };
    });

    const queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        createQueryBuilder: jest.fn(() => builder),
      },
    };

    (AppDataSource.createQueryRunner as jest.Mock).mockReturnValue(queryRunner);
    (AppDataSource.initialize as jest.Mock).mockResolvedValue(undefined);
    (AppDataSource.destroy as jest.Mock).mockResolvedValue(undefined);

    const inserted = await importWordsFromDictionary({
      fire: 1,
      water: 1,
      fire: 1,
    });

    expect(inserted).toBe(2);
    expect(queryRunner.commitTransaction).toHaveBeenCalled();
    expect(AppDataSource.destroy).toHaveBeenCalled();
  });
});
