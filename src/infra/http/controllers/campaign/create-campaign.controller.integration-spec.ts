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
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CreateCampaignControllerBody } from "./create-campaign.controller";

describe("[Controller] POST /campaign", () => {
  let app: NestFastifyApplication;
  let notion: NotionService;

  let input: CreateCampaignControllerBody;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    notion = moduleRef.get(NotionService);

    input = {
      company: faker.company.name(),
      campaign: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      plannedDate: faker.date.recent().toISOString().split("T")[0],
      where: faker.lorem.sentence(),
      language: faker.lorem.sentence(),
      content: faker.lorem.sentence(),
      imageContent: faker.lorem.sentence(),
      images: [],
    };

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a campaign", async () => {
    const response = await request(app.getHttpServer())
      .post("/campaign")
      .send(input);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toStrictEqual({ id: expect.any(String) });

    const campaignOnDatabase = await notion.pages.retrieve({
      page_id: response.body.id,
    });

    expect(campaignOnDatabase).toBeTruthy();

    await notion.pages.update({ page_id: response.body.id, archived: true });
  });
});
