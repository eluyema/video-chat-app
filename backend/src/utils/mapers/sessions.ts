import SessionEntity from 'src/modules/session/session.enity';
import { PublicSession } from 'src/modules/session/session.types';

export const getPublicSession = (session: SessionEntity): PublicSession => {
  return {
    shareId: session.shareId,
    reusable: session.reusable,
    isRanning: session.isRanning,
    title: session.title,
    description: session.description,
    plannedDate: session.plannedDate,
    security: session.security,
    authorEmail: session.author.email,
  };
};
