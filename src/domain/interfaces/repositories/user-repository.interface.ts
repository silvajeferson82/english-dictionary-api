import { User } from '../../entities/user.entity';

export type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
};

export interface IUserRepository {
  insert(input: CreateUserInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
