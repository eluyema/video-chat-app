import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ManyToMany } from 'typeorm/decorator/relations/ManyToMany';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import UserEntity from '../user/user.enity';

export enum SessionSecurity {
  NONE = 'NONE',
  PERMISSION = 'PERMISSION',
  PASSWORD = 'PASSWORD',
  REGISTRED = 'REGISTRED',
}

@Entity({ name: 'sessions' })
export default class SessionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  shareId: string;

  @Column()
  reusable: boolean;

  @Column()
  isRanning: boolean;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  twilioRoomId: string;

  @Column({ type: 'timestamptz', nullable: true })
  plannedDate: Date;

  @Column({
    type: 'enum',
    enum: SessionSecurity,
  })
  security: SessionSecurity;

  @Column({ nullable: true })
  password: string;

  @ManyToOne(() => UserEntity, (user) => user.createdSessions, {
    nullable: false,
  })
  author: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.friendlySessions, {
    nullable: true,
  })
  approvedParticipants: UserEntity[];
}
