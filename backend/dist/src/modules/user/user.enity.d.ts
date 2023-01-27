import { BaseEntity } from 'typeorm';
import SessionEntity from '../session/session.enity';
export default class UserEntity extends BaseEntity {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdSessions: SessionEntity[];
    friendlySessions: SessionEntity[];
}
