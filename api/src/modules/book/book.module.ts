import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  controllers: [BookController],
  providers: [BookService],
  imports: [AiModule],
})
export class BookModule {}
