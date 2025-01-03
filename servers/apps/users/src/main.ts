import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UsersModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    // methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    // allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow cookies and authentication headers
  });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname,'..', 'servers/email-templates'));
  app.setViewEngine('ejs');
  await app.listen(process.env.port ?? 4001);
}
bootstrap();
