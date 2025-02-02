import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  async create(
    file: Express.Multer.File,
    createBookDto: CreateBookDto,
    userId: string,
    folderName: string = 'uploads/epubs',
  ) {
    if (!file || !file.filename) {
      throw new Error('File is missing or does not have a filename');
    }
    const uploadsFolder = path.join(folderName);
    await fs.mkdir(uploadsFolder, { recursive: true });
    const filePath = path.join(
      uploadsFolder,
      userId + '-' + file.originalname + '.epub',
    );
    await fs.writeFile(filePath, file.buffer);
    return {
      message: 'New book has been added',
    };
  }

  findAll() {
    return `This action returns all book`;
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
