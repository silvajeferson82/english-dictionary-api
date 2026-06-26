import { UserHistory } from '../../entities/user-history.entity';

export type CreateUserHistoryInput = {
  userId: string;
  word: string;
};

export type FindUserHistoryInput = {
  userId: string;
  page: number;
  limit: number;
};

export type FindUserHistoryOutput = {
  results: UserHistory[];
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export interface IUserHistoryRepository {
  insert(input: CreateUserHistoryInput): Promise<UserHistory>;
  findByUserId(input: FindUserHistoryInput): Promise<FindUserHistoryOutput>;
}
