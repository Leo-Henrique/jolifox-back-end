import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { NotionService } from "@/infra/database/notion/notion.service";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import request from "supertest";
import {
  CampaignFactory,
  CampaignFactoryOutput,
} from "test/factories/campaign.factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("[Controller] DELETE /campaign/:id", () => {
  let app: NestFastifyApplication;
  let notion: NotionService;
  let campaignFactory: CampaignFactory;

  let campaign: CampaignFactoryOutput;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CampaignFactory],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    notion = moduleRef.get(NotionService);
    campaignFactory = moduleRef.get(CampaignFactory);

    campaign = await campaignFactory.makeAndSaveUnique();

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to delete a campaign", async () => {
    const response = await request(app.getHttpServer()).delete(
      `/campaign/${campaign.id}`,
    );

    expect(response.statusCode).toEqual(204);

    const campaignOnDatabase = await notion.pages.retrieve({
      page_id: campaign.id,
    });

    // @ts-expect-error archived actually exist
    expect(campaignOnDatabase.archived).toBe(true);
  });
});
