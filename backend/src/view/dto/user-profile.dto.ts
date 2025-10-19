import  {User}  from '../../models/user.model';

export class UserProfileDto {
  id: number;
  name: string;
  email: string;

  /**
   * Mapeia a Entidade User (do banco de dados).
   * @param user
   * @returns
   */
  public static fromEntity(user: User): UserProfileDto {
    const dto = new UserProfileDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    return dto;
  }
}