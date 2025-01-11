import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

@Module({
  imports: [
    JwtModule.register({ global: true }),
    MulterModule.register({ storage: memoryStorage() })
  ],
  exports: [JwtModule, MulterModule]
})
export class CoreModule {}
