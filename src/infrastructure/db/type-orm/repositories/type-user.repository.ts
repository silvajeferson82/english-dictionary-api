import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserInput,
  IUserRepository,
} from '../../../../domain/interfaces/repositories/user-repository.interface';
import { User } from '../../../../domain/entities/user.entity';

@Injectable()
export class TypeUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async insert(input: CreateUserInput): Promise<User> {
    const entity = this.repository.create({
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
    });

    return this.repository.save(entity);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }
}
