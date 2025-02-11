import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ShelfService } from './shelf.service';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';
import { UserId } from 'src/common/decorator/user_id.decorator';
import { QueryDto } from 'src/common/dtos/query.dto';

@Controller('shelf')
export class ShelfController {
  constructor(private readonly shelfService: ShelfService) {}

  @Post()
  create(@Body() createShelfDto: CreateShelfDto, @UserId() userId: string) {
    return this.shelfService.create(createShelfDto, userId);
  }

  @Get()
  findAll(@UserId() userId: string, @Query() query: QueryDto) {
    return this.shelfService.findAll(userId, query);
  }

  @Get('total_count')
  count(@UserId() userId: string, @Query() query: QueryDto) {
    return this.shelfService.count(userId, query);
  }

  @Get('light')
  findLight(@UserId() userId: string) {
    return this.shelfService.findLight(userId);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shelfService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShelfDto: UpdateShelfDto) {
    return this.shelfService.update(id, updateShelfDto);
  }

  @Patch('add-book/:bookId')
  addBookToShelf(
    @Body()
    shelfData: {
      id: string;
    },
    @Param('bookId') bookId: string,
  ) {
    return this.shelfService.addBookToShelf(shelfData.id, bookId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: string) {
    return this.shelfService.remove(id);
  }
}
