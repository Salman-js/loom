import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: Joi.object({
    POSTGRES_HOST: Joi.string().required(),
    POSTGRES_PORT: Joi.number().required(),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_DB: Joi.string().required(),
    ACCESS_TOKEN_SECRET: Joi.string().min(5).required(),
    REFRESH_TOKEN_SECRET: Joi.string().min(5).required(),
    ACCESS_TOKEN_LIFE: Joi.string().required(),
    REFRESH_TOKEN_LIFE: Joi.string().required(),
    PORT: Joi.number(),
  }),
});
