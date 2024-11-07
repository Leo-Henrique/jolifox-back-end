import { Module } from "@nestjs/common";
import { NotionService } from "./notion/notion.service";

@Module({
  providers: [NotionService],
  exports: [NotionService],
})
export class DatabaseModule {}
