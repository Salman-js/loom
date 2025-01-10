import { IUser } from '@/features/users/interface/user.interface';
import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
type State = {
  user?: IUser;
};
type Action = {
  setUser: (newUser: IUser) => void;
  signOut: () => void;
};
export const store = createStore<State & Action>()(
  persist(
    (set) => ({
      user: undefined,
      setUser: (newUser: IUser) => set({ user: newUser }),
      signOut: () => set({ user: undefined }),
    }),
    { name: 'logged-user' }
  )
);
