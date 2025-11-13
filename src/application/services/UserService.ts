import { User } from '../../domain/User.js';
import type { IUserRepository } from '../../domain/IUserRepository.js';
import { InvalidInputError } from '../../domain/errors.js';

export interface CreateUserInput {
  id: string;
  name: string;
}

export class UserService {
  private readonly userRepository: IUserRepository;

  constructor({ userRepository }: { userRepository: IUserRepository }) {
    this.userRepository = userRepository;
  }

  async createUser({ id, name }: CreateUserInput): Promise<User> {
    const trimmedId = id.trim();
    if (!trimmedId) {
      throw new InvalidInputError('User id must not be empty');
    }

    if (trimmedId.length > 255) {
      throw new InvalidInputError('User id must not exceed 255 characters');
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new InvalidInputError('User name must not be empty');
    }

    const user = new User(trimmedId, trimmedName);
    return this.userRepository.create(user);
  }
}
