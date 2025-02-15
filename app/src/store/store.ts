import { IUser } from '@/features/users/interface/user.interface';
import { createStore } from 'zustand/vanilla';
import { persist, devtools } from 'zustand/middleware';
type State = {
  user?: IUser;
};
type TokenState = {
  token?: string | null;
};
type Action = {
  setUser: (newUser: IUser) => void;
  signOut: () => void;
};

type TokenAction = {
  setToken: (newToken: string | null) => void;
};
export type ReaderStyleState = {
  background: React.CSSProperties['color'];
  text: React.CSSProperties['color'];
  fontFamily: React.CSSProperties['fontFamily'];
  fontSize: React.CSSProperties['fontSize'];
};

type ReaderLocationState = {
  location: string | number;
};

type ReaderLocationAction = {
  setLocation: (newLocation: string | number) => void;
  resetLocation: () => 1;
};
type ReaderStyleAction = {
  setColorStyle: ({
    background,
    text,
  }: {
    background: React.CSSProperties['color'];
    text: React.CSSProperties['color'];
  }) => void;
  setFontFamily: (fontFamily: React.CSSProperties['fontFamily']) => void;
  setFontSize: (fontSize: React.CSSProperties['fontSize']) => void;
  resetStyle: () => void;
};
export const store = createStore<State & Action>()(
  persist(
    devtools(
      (set) => ({
        user: undefined,
        setUser: (newUser: IUser) => set({ user: newUser }),
        signOut: () => set({ user: undefined }),
      }),
      { name: 'logged-user' }
    ),
    { name: 'logged-user' }
  )
);

export const tokenStore = createStore<TokenState & TokenAction>()(
  persist(
    devtools(
      (set) => ({
        token: undefined,
        setToken: (newToken: string) => set({ token: newToken }),
      }),
      { name: 'user-token' }
    ),
    { name: 'user-token' }
  )
);
export const readerLocationStore = createStore<
  ReaderLocationState & ReaderLocationAction
>()(
  persist(
    devtools(
      (set) => ({
        location: 1,
        setLocation: (newLocation: string | number) =>
          set({ location: newLocation }),
        resetLocation: () => set({ location: undefined }),
      }),
      { name: 'reader-location' }
    ),
    { name: 'reader-location' }
  )
);
export const readerStyleStore = createStore<
  ReaderStyleState & ReaderStyleAction
>()(
  persist(
    (set) => ({
      background: '#fafafa',
      text: '#18181b',
      fontFamily: 'font-arial',
      fontSize: 16,
      setColorStyle: ({
        background,
        text,
      }: {
        background: React.CSSProperties['color'];
        text: React.CSSProperties['color'];
      }) => set({ background, text }),
      setFontFamily: (fontFamily: React.CSSProperties['fontFamily']) =>
        set({ fontFamily }),
      setFontSize: (fontSize: React.CSSProperties['fontSize']) =>
        set({ fontSize }),
      resetStyle: () =>
        set({
          background: '#18181b',
          text: '#fafafa',
          fontFamily: 'serif',
          fontSize: '16px',
        }),
    }),
    { name: 'reader-style' }
  )
);
