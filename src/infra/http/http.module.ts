import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { DatabaseModule } from "../database/database.module";
import { CreateCampaignController } from "./controllers/campaign/create-campaign.controller";
import { UpdateCampaignController } from "./controllers/campaign/update-campaign.controller";
import { HelloMultipartController } from "./controllers/hello/hello-multipart.controller";
import { HelloController } from "./controllers/hello/hello.controller";
import { AllExceptionFilter } from "./errors/filters/all-exception.filter";
import { FastifyMulterEventModule } from "./events/fastify-multer.event.module";
import { DeleteCampaignController } from "./controllers/campaign/delete-campaign.controller";
import { GetCampaignController } from "./controllers/campaign/get-campaign.controller";

@Module({
  imports: [FastifyMulterEventModule, DatabaseModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
  controllers: [
    HelloController,
    HelloMultipartController,
    CreateCampaignController,
    UpdateCampaignController,
    DeleteCampaignController,
    GetCampaignController,
  ],
})
export class HttpModule {}
