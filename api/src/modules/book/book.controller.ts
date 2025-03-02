import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  RawBody,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import {
  CreateBookDto,
  CreateBookmarkDto,
  CreateHighlightDto,
  CreateNoteDto,
} from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { UserId } from 'src/common/decorator/user_id.decorator';
import { FormDataInterceptor } from 'src/utils/interceptors/formData.interceptor';
import { QueryDto } from 'src/common/dtos/query.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'book', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  create(
    @UploadedFiles()
    files: { book?: Express.Multer.File[]; cover?: Express.Multer.File[] },
    @Body() createBookDto: CreateBookDto,
    @UserId() userId: string,
  ) {
    const book = files.book?.[0];
    const cover = files.cover?.[0];
    return this.bookService.create(book, cover, createBookDto, userId);
  }

  @Get()
  findAll(@UserId() userId: string, @Query() query: QueryDto) {
    return this.bookService.findAll(userId, query);
  }

  @Get('total_count')
  count(@UserId() userId: string, @Query() query: QueryDto) {
    return this.bookService.count(userId, query);
  }

  @Get('light')
  findLight(@UserId() userId: string) {
    return this.bookService.findLight(userId);
  }

  @Get('details/:id')
  getBookDetails(@Param('id') id: string) {
    return this.bookService.getBookDetails(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Patch(':id/note')
  addNote(
    @Param('id') id: string,
    @Body() createNoteDto: CreateNoteDto,
    @UserId() userId: string,
  ) {
    return this.bookService.addNote(id, createNoteDto, userId);
  }

  @Patch(':id/highlight')
  addHighlight(
    @Param('id') id: string,
    @Body() createHighlightDto: CreateHighlightDto,
    @UserId() userId: string,
  ) {
    return this.bookService.addHighlight(id, createHighlightDto, userId);
  }

  @Patch(':id/bookmark')
  updateBookmark(
    @Param('id') id: string,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookService.updateBookmark(id, createBookmarkDto);
  }

  @Delete(':id/note')
  removeNote(@Body() body: { cfiRange: string }, @Param('id') id: string) {
    return this.bookService.removeNote(body.cfiRange, id);
  }

  @Delete(':id/highlight')
  removeHighlight(@Body() body: { cfiRange: string }, @Param('id') id: string) {
    return this.bookService.removeHighlight(body.cfiRange, id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: string) {
    return this.bookService.remove(id);
  }
}
