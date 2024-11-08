import { env } from "@/infra/env";
import { Client } from "@notionhq/client";

export class NotionService extends Client {
  public constructor() {
    super({
      auth: env.NOTION_ACCESS_TOKEN,
    });
  }
}
