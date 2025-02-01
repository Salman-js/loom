import { Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'path';
import sharp from 'sharp';

type FileInput = Express.Multer.File | Express.Multer.File[];
type FileOutput =
  | { filename: string; buffer: Buffer }
  | Array<{ filename: string; buffer: Buffer }>;

@Injectable()
export class SharpPipe
  implements PipeTransform<FileInput, Promise<FileOutput>>
{
  async transform(image: FileInput): Promise<FileOutput> {
    if (Array.isArray(image)) {
      return Promise.all(image.map((file) => this.processFile(file)));
    }
    return this.processFile(image);
  }

  private async processFile(
    file: Express.Multer.File
  ): Promise<{ filename: string; buffer: Buffer }> {
    const originalName = path.parse(file.originalname).name;
    const filename = `${Date.now()}-${originalName}.webp`;

    const buffer = await sharp(file.buffer)
      .resize(800)
      .webp({ effort: 3 })
      .toBuffer();

    return { filename, buffer };
  }
}
