import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { DatabaseModule } from "../database/database.module";
import { CreateCampaignController } from "./controllers/campaign/create-campaign.controller";
import { DeleteCampaignController } from "./controllers/campaign/delete-campaign.controller";
import { GetCampaignController } from "./controllers/campaign/get-campaign.controller";
import { UpdateCampaignController } from "./controllers/campaign/update-campaign.controller";
import { AllExceptionFilter } from "./errors/filters/all-exception.filter";

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
  controllers: [
    CreateCampaignController,
    UpdateCampaignController,
    DeleteCampaignController,
    GetCampaignController,
  ],
})
export class HttpModule {}
