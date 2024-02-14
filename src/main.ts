import './config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import SwaggerConfig from './config/swagger.config';
import { VersioningType } from '@nestjs/common';
import { getGlobalFilters } from './common/exceptions';
import { ValidationPipeErorr } from './common/pipes';
import { json, urlencoded } from 'express';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({origin:[process.env.URL_CLIENT],credentials:true});
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(json());
  app.use(urlencoded({extended:true}));
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  // execptions and validator pipe
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(...getGlobalFilters(httpAdapter));
  app.useGlobalPipes(new ValidationPipeErorr());
  // swagger config
  SwaggerConfig(app);
  app.useStaticAssets(join(__dirname,'..','public'),{
    prefix:"/static"
  });
  await app.listen(process.env.APP_PORT, () => {
    console.log(`Run > http:localhost:${process.env.APP_PORT}`);
    console.log(`Run swagger > http:localhost:${process.env.APP_PORT}/api-doc`);
  });
}
bootstrap();
