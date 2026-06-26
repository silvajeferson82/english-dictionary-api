import { UserFavorite } from '../../entities/user-favorite.entity';

export type CreateUserFavoriteInput = {
  userId: string;
  word: string;
};

export type FindUserFavoritesInput = {
  userId: string;
  page: number;
  limit: number;
};

export type FindUserFavoritesOutput = {
  results: UserFavorite[];
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export interface IUserFavoriteRepository {
  insert(input: CreateUserFavoriteInput): Promise<UserFavorite>;
  deleteByUserAndWord(userId: string, word: string): Promise<void>;
  findByUserId(input: FindUserFavoritesInput): Promise<FindUserFavoritesOutput>;
  exists(userId: string, word: string): Promise<boolean>;
}
