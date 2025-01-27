import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { prisma } from './prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, Github],
  adapter: PrismaAdapter(prisma),
});
