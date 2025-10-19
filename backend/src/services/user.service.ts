import { AppDataSource } from '../database/data-source';
import { User } from '../models/user.model';
import { UserProfileDto } from '../view/dto/user-profile.dto';

const userRepository = AppDataSource.getRepository(User);

class UserService {
  /**
   * @param userId
   * @returns
   */

  // Perfil do usuário
  public async getProfile(userId: number): Promise<UserProfileDto> {
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    return UserProfileDto.fromEntity(user);
  }
}

export default new UserService();