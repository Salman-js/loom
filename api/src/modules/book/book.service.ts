import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { QueryDto } from 'src/common/dtos/query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookService {
  logger = new Logger(BookService.name);
  const;
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}
  async create(
    file: Express.Multer.File,
    cover: Express.Multer.File,
    createBookDto: CreateBookDto,
    userId: string,
    folderName: string = 'uploads',
  ) {
    try {
      if (!file || !file.originalname) {
        throw new Error('File is missing or does not have a filename');
      }
      const baseName = `${userId}-${file.originalname?.replace('.epub', '')}-${Date.now()}`;
      const uploadsFolder = path.join(folderName + '/epubs');
      const coversFolder = path.join(folderName + '/covers');
      await fs.mkdir(uploadsFolder, { recursive: true });
      await fs.mkdir(coversFolder, { recursive: true });
      const filePath = path.join(uploadsFolder, `${baseName}.epub`);
      const coverPath = path.join(coversFolder, `${baseName}.png`);
      const book = await this.txHost.tx.book.create({
        data: {
          ...createBookDto,
          cover: coverPath,
          path: filePath,
          userId,
        },
      });
      await fs.writeFile(coverPath, cover.buffer);
      await fs.writeFile(filePath, file.buffer);
      return {
        message: createBookDto?.title,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  host = process.env.HOST;
  async findAll(userId: string, query: QueryDto) {
    try {
      const { page = 1, search, size = 20, sortBy, sortOrder } = query;
      const skip = (page - 1) * size;
      const take = size;
      const where: Prisma.BookWhereInput = {
        userId,
      };

      if (search) {
        where.AND = {
          OR: [
            {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              author: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        };
      }

      const books = await this.txHost.tx.book.findMany({
        where,
        skip,
        take,
        orderBy: sortBy
          ? {
              [sortBy]: sortOrder,
            }
          : {
              createdAt: 'desc',
            },
      });
      return books.map((book) => ({
        ...book,
        cover: this.host + book.cover,
        bath: this.host + book.path,
      }));
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
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
