import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  //swagger config
  const config = new DocumentBuilder()
    .setTitle('Spotify Clone')
    .setDescription ('The Spotify Clone Api documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',//JWT-auth on controller func
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // to enable seeding
  // const seedService = app.get(SeedService);
  // await seedService.seed();
  const configService = app.get(ConfigService);
  // await app.listen(configService.get<number>('port'));
  await app.listen(configService.get<number>('port'));
  console.log(configService.get<string>('NODE_ENV'));
  if(module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
