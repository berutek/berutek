import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Unique,
} from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity('permissions')
@Unique(['resource', 'action'])
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  resource: string;

  @Column()
  action: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];
}
