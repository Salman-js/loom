import { Injectable } from '@nestjs/common';
import argon2 from 'argon2';

@Injectable()
export class HashService {
  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }
}
