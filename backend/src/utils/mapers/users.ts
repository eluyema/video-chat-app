import { PublicSession } from 'src/modules/session/session.types';
import UserEntity from 'src/modules/user/user.enity';
import { PublicUser } from 'src/modules/user/user.types';

export const getPublicUser = (user: UserEntity): PublicUser => {
    
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
  };
}

