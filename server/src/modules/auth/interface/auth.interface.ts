import { Request } from 'express';
import { User } from '@prisma/client';

export interface TokenPayload {
  userId: string;
  email: string;
}

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;
