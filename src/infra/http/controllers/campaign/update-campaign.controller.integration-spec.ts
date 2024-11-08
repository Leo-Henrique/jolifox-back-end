import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { NotionService } from "@/infra/database/notion/notion.service";
import { faker } from "@faker-js/faker";
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
import { UpdateCampaignControllerBody } from "./update-campaign.controller";
import { delay } from "test/delay";

describe("[Controller] PUT /campaign/:id", () => {
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
    // O Notion suporta apenas 3 solicitações por segundo (https://developers.notion.com/reference/request-limits)
    await delay(1000);
    await notion.pages.update({ page_id: campaign.id, archived: true });
  });

  it("should be able to update a campaign", async () => {
    const input = {
      campaign: faker.lorem.sentence(),
    } satisfies UpdateCampaignControllerBody;

    const response = await request(app.getHttpServer())
      .put(`/campaign/${campaign.id}`)
      .send(input);

    expect(response.statusCode).toEqual(204);

    const campaignOnDatabase = await notion.pages.retrieve({
      page_id: campaign.id,
    });

    expect(
      // @ts-expect-error properties actually exist
      campaignOnDatabase.properties.Campaign.rich_text[0].plain_text,
    ).toEqual(input.campaign);
  });
});