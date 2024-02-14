import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
export default function SwaggerConfig(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('****** gold wallet Application Api ******')
    .addSecurity('authorization',{
      type:'http',
      scheme:'bearer',
      bearerFormat:'JWT',
      name:'authorization',
      in:'header'
    })
    .setContact('alireza', null, 'alirezazamanidev80@gmail.com')
    .setDescription('The gold wallet api document!')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, {});
  SwaggerModule.setup('api-doc', app, document);
}
