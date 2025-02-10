import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { QueryDto } from 'src/common/dtos/query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ShelfService {
  logger = new Logger(ShelfService.name);
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}
  host = process.env.HOST;
  async create(createShelfDto: CreateShelfDto, userId: string) {
    try {
      const { books, ...rest } = createShelfDto;
      const existingShelf = await this.txHost.tx.shelf.findFirst({
        where: {
          name: rest.name,
          userId,
        },
      });
      if (existingShelf) {
        throw new ConflictException(existingShelf?.name);
      }
      const shelf = await this.txHost.tx.shelf.create({
        data: {
          ...rest,
          books: {
            connect: books.map((bookId) => ({ id: bookId })),
          },
          userId,
        },
      });
      return {
        message: createShelfDto?.name,
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
      const where: Prisma.ShelfWhereInput = {
        userId,
      };

      if (search) {
        where.AND = {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              books: {
                some: {
                  title: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
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

      const shelves = await this.txHost.tx.shelf.findMany({
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
          books: true,
        },
      });
      return shelves.map((shelf) => ({
        ...shelf,
        books: shelf.books.map((book) => ({
          ...book,
          cover: (this.host + book.cover).replace(/\\/g, '/'),
        })),
      }));
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async count(userId: string, query: QueryDto) {
    try {
      const { search, sortBy, sortOrder } = query;
      const where: Prisma.ShelfWhereInput = {
        userId,
      };

      if (search) {
        where.AND = {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              books: {
                some: {
                  title: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
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
      const shelves = await this.txHost.tx.shelf.count({
        where,
      });
      return shelves;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async findOne(id: string) {
    try {
      const shelf = await this.txHost.tx.shelf.findFirst({
        where: {
          id,
        },
        include: {
          books: true,
        },
      });
      if (!shelf) {
        throw new NotFoundException('Shelf not found');
      }
      return {
        ...shelf,
        books: shelf.books.map((book) => ({
          ...book,
          cover: (this.host + book.cover).replace(/\\/g, '/'),
        })),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async update(id: string, updateShelfDto: UpdateShelfDto) {
    try {
      const { books, ...rest } = updateShelfDto;
      const checkShelf = await this.txHost.tx.shelf.findFirst({
        where: {
          id,
        },
      });
      if (!checkShelf) {
        throw new NotFoundException('Shelf not found');
      }
      const existingShelf = await this.txHost.tx.shelf.findFirst({
        where: {
          name: rest.name,
          userId: checkShelf.userId,
        },
      });
      if (existingShelf) {
        throw new ConflictException(existingShelf?.name);
      }
      const shelf = await this.txHost.tx.shelf.update({
        where: { id },
        data: {
          ...rest,
          books: {
            set: [],
            connect: updateShelfDto.books.map((bookId) => ({ id: bookId })),
          },
        },
      });
      return {
        message: updateShelfDto?.name,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const shelf = await this.txHost.tx.shelf.findFirst({
        where: {
          id,
        },
      });
      if (!shelf) {
        throw new NotFoundException('Shelf not found');
      }
      return this.txHost.tx.shelf.delete({
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
