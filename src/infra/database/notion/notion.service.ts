import { env } from "@/infra/env";
import { Client, LogLevel } from "@notionhq/client";

export class NotionService extends Client {
  public constructor() {
    super({
      auth: env.NOTION_ACCESS_TOKEN,
      logLevel: LogLevel.DEBUG,
    });
  }
}
