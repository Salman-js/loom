import { User } from 'next-auth';

export interface IUser extends User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}
