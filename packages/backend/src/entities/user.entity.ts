import { Column, Entity, PrimaryColumn } from 'typeorm';
import { User, UserData, UserRole } from '../user/user.domain';

@Entity('users')
export class UserEntity implements UserData {
  @PrimaryColumn()
  public id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;

  public static FromDomain(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.username = user.username;
    entity.password = user.password;
    entity.role = user.role;
    return entity;
  }

  toDomain(): User {
    return new User({
      id: this.id,
      username: this.username,
      password: this.password,
      role: this.role,
    });
  }
}
