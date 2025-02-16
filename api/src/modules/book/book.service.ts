import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import {
  CreateBookDto,
  CreateBookmarkDto,
  CreateHighlightDto,
  CreateNoteDto,
} from './dto/create-book.dto';
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
  host = process.env.HOST;
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
        path: this.host + book.path,
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

  async findLight(userId: string) {
    try {
      const where: Prisma.BookWhereInput = {
        userId,
      };

      const books = await this.txHost.tx.book.findMany({
        where,
        orderBy: {
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
  async findOne(id: string) {
    try {
      const book = await this.txHost.tx.book.findFirst({
        where: {
          id,
        },
        include: {
          highlights: true,
          notes: true,
        },
      });
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      return {
        ...book,
        cover: this.host + book.cover,
        path: this.host + book.path,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async updateBookmark(id: string, createBookmarkDto: CreateBookmarkDto) {
    try {
      const book = await this.txHost.tx.book.findFirst({
        where: {
          id,
        },
      });
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      const updatedBook = await this.txHost.tx.book.update({
        where: {
          id,
        },
        data: {
          lastBookmark: createBookmarkDto.cfi,
        },
      });
      return {
        data: updatedBook,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async addNote(id: string, createNoteDto: CreateNoteDto, userId: string) {
    try {
      const book = await this.txHost.tx.book.findFirst({
        where: {
          id,
        },
      });
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      await this.txHost.tx.book.update({
        where: {
          id,
        },
        data: {
          notes: {
            upsert: {
              where: {
                bookId_cfiRange: {
                  bookId: id,
                  cfiRange: createNoteDto.cfiRange,
                },
              },
              create: {
                cfiRange: createNoteDto.cfiRange,
                text: createNoteDto.text,
                note: createNoteDto.note,
                userId: userId,
              },
              update: {
                cfiRange: createNoteDto.cfiRange,
                text: createNoteDto.text,
                note: createNoteDto.note,
                userId: userId,
              },
            },
          },
        },
      });
      return {
        message: createNoteDto?.note,
        data: createNoteDto,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async addHighlight(
    id: string,
    createHighlightDto: CreateHighlightDto,
    userId: string,
  ) {
    try {
      const book = await this.txHost.tx.book.findFirst({
        where: {
          id,
        },
      });
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      await this.txHost.tx.book.update({
        where: {
          id,
        },
        data: {
          highlights: {
            upsert: {
              where: {
                bookId_cfiRange: {
                  bookId: id,
                  cfiRange: createHighlightDto.cfiRange,
                },
              },
              create: {
                cfiRange: createHighlightDto.cfiRange,
                text: createHighlightDto.text,
                color: createHighlightDto.color,
                userId: userId,
              },
              update: {
                cfiRange: createHighlightDto.cfiRange,
                text: createHighlightDto.text,
                color: createHighlightDto.color,
                userId: userId,
              },
            },
          },
        },
      });
      return {
        message: `Highlighted ${createHighlightDto?.text}`,
        data: createHighlightDto,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async removeNote(cfiRange: string, bookId: string) {
    try {
      const note = await this.txHost.tx.note.findFirst({
        where: {
          cfiRange,
          bookId,
        },
      });
      if (!note) {
        throw new NotFoundException('Note not found');
      }
      await this.txHost.tx.note.delete({
        where: { id: note?.id },
      });
      return {
        message: null,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async removeHighlight(cfiRange: string, bookId: string) {
    try {
      const highlight = await this.txHost.tx.highlight.findFirst({
        where: {
          cfiRange,
          bookId,
        },
      });
      if (!highlight) {
        throw new NotFoundException('Highlight not found');
      }
      await this.txHost.tx.highlight.delete({
        where: { id: highlight.id },
      });
      return {
        message: null,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
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
