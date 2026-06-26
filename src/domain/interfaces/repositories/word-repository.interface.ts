import { Word } from '../../entities/word.entity';

export type CreateWordInput = {
  word: string;
  data: unknown;
};

export type SearchWordsInput = {
  search?: string;
  page: number;
  limit: number;
};

export type SearchWordsOutput = {
  results: Word[];
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export interface IWordRepository {
  insert(input: CreateWordInput): Promise<Word>;
  findByWord(word: string): Promise<Word | null>;
  search(input: SearchWordsInput): Promise<SearchWordsOutput>;
  findById(id: string): Promise<Word | null>;
}
