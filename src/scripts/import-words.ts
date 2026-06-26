import AppDataSource from '../infrastructure/db/data-source';
import { Word } from '../domain/entities/word.entity';

const WORDS_DICTIONARY_URL =
  'https://github.com/dwyl/english-words/raw/master/words_dictionary.json';
const BATCH_SIZE = 2000;

type WordsDictionary = Record<string, number>;

export const chunkWords = (words: string[], size = BATCH_SIZE): string[][] => {
  const chunks: string[][] = [];

  for (let index = 0; index < words.length; index += size) {
    chunks.push(words.slice(index, index + size));
  }

  return chunks;
};

export const extractWords = (dictionary: WordsDictionary): string[] =>
  Object.keys(dictionary);

export const importWordsFromDictionary = async (
  dictionary: WordsDictionary,
): Promise<number> => {
  const words = extractWords(dictionary);
  const batches = chunkWords(words);
  let inserted = 0;

  await AppDataSource.initialize();
  const queryRunner = AppDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    for (const batch of batches) {
      const values = batch.map((word) => ({
        word,
        data: { word },
      }));
      const result = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Word)
        .values(values)
        .orIgnore()
        .execute();

      inserted += result.identifiers.length;
    }

    await queryRunner.commitTransaction();
    return inserted;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
};

const fetchDictionary = async (): Promise<WordsDictionary> => {
  const response = await fetch(WORDS_DICTIONARY_URL);

  if (!response.ok) {
    throw new Error(`Failed to download dictionary: ${response.status}`);
  }

  return (await response.json()) as WordsDictionary;
};

export const runImportWordsScript = async (): Promise<void> => {
  const dictionary = await fetchDictionary();
  const inserted = await importWordsFromDictionary(dictionary);
  // eslint-disable-next-line no-console
  console.log(`Imported ${inserted} words`);
};

if (require.main === module) {
  void runImportWordsScript();
}
