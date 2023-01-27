import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ManyToMany } from 'typeorm/decorator/relations/ManyToMany';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import SessionEntity from '../session/session.enity';

@Entity({ name: 'users' })
export default class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => SessionEntity, (session) => session.author, {
    nullable: true,
  })
  createdSessions: SessionEntity[];

  @ManyToMany(() => SessionEntity, (session) => session.approvedParticipants, {
    nullable: true,
  })
  friendlySessions: SessionEntity[];
}
