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

describe("[Controller] GET /campaign/:id", () => {
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
    await notion.pages.update({ page_id: campaign.id, archived: true });
  });

  it("should be able to get a campaign", async () => {
    const response = await request(app.getHttpServer()).get(
      `/campaign/${campaign.id}`,
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeTruthy();
  });
});
