import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { DatabaseModule } from "../database/database.module";
import { HelloMultipartController } from "./controllers/hello/hello-multipart.controller";
import { HelloController } from "./controllers/hello/hello.controller";
import { AllExceptionFilter } from "./errors/filters/all-exception.filter";
import { FastifyMulterEventModule } from "./events/fastify-multer.event.module";

@Module({
  imports: [FastifyMulterEventModule, DatabaseModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
  controllers: [HelloController, HelloMultipartController],
})
export class HttpModule {}
