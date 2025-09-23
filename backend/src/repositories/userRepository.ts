import { AppDataSource } from '../data-source'
import { User } from '../app/models/User'

export const userRepository = AppDataSource.getRepository(User);
