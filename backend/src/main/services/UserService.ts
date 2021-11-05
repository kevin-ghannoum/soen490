import { injectable } from 'tsyringe';
import debug from 'debug';
import UserRepository from '../repositories/UserRepository';
import { UserDTO } from '../dto/UserDTO';
const log: debug.IDebugger = debug('app:userService-example');

@injectable()
export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    log('Created new instance of UserService');
    this.userRepository = userRepository;
  }

  public createUser = async (user: UserDTO): Promise<UserDTO> => {
    return await this.userRepository.create(user);
  };

  public getUser = async (userId: string): Promise<string> => {
    return await this.userRepository.get(userId);
  };

  // implement update and delete
}
