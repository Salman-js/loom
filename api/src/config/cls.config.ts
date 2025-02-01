import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { DatabaseModule } from '../modules/database/database.module';
import { DatabaseService } from '../modules/database/database.service';

export const clsModule = ClsModule.forRoot({
  plugins: [
    new ClsPluginTransactional({
      imports: [DatabaseModule],
      adapter: new TransactionalAdapterPrisma({
        prismaInjectionToken: DatabaseService,
      }),
    }),
  ],
});
