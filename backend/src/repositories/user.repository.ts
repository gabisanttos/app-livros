import { AppDataSource } from '../database/data-source'
import { User } from '../models/user.model';

export const userRepository = AppDataSource.getRepository(User);
