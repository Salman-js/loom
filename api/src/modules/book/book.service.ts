import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { QueryDto } from 'src/common/dtos/query.dto';
import { Prisma } from '@prisma/client';
import { AiService } from '../ai/ai.service';

@Injectable()
export class BookService {
  logger = new Logger(BookService.name);
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly aiService: AiService,
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
        throw new BadRequestException(
          'File is missing or does not have a filename',
        );
      }
      const existingBook = await this.txHost.tx.book.findFirst({
        where: {
          title: createBookDto.title,
          userId,
        },
      });
      if (existingBook) {
        throw new ConflictException(existingBook?.title);
      }
      const baseName = `${userId}-${file.originalname?.replace('.epub', '')}-${Date.now()}`;
      const uploadsFolder = path.join(folderName + '/epubs');
      const coversFolder = path.join(folderName + '/covers');
      await fs.mkdir(uploadsFolder, { recursive: true });
      await fs.mkdir(coversFolder, { recursive: true });
      const filePath = path.join(uploadsFolder, `${baseName}.epub`);
      const coverPath = path.join(coversFolder, `${baseName}.png`);
      const descriptionAndGenre =
        await this.aiService.generateDescription(createBookDto);

      const book = await this.txHost.tx.book.create({
        data: {
          ...createBookDto,
          description: descriptionAndGenre?.description,
          genre: descriptionAndGenre?.genre,
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
        include: {
          shelves: {
            select: {
              id: true,
            },
          },
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

  async count(userId: string, query: QueryDto) {
    try {
      const { search, sortBy, sortOrder } = query;
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

      const books = await this.txHost.tx.book.count({
        where,
      });
      return books;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async findOne(id: string) {
    try {
      const book = await this.txHost.tx.book.findFirst({
        where: {
          id,
        },
      });
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      return {
        ...book,
        cover: this.host + book.cover,
        bath: this.host + book.path,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  async remove(id: string) {
    try {
      const book = await this.txHost.tx.book.findFirst({
        where: {
          id,
        },
      });
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      // delete book file and cover picture saved inside uploads folder
      await fs.unlink(book.path);
      await fs.unlink(book.cover);
      return this.txHost.tx.book.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
