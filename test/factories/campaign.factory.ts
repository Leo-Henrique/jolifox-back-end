import { NotionService } from "@/infra/database/notion/notion.service";
import { env } from "@/infra/env";
import { CreateCampaignControllerBody } from "@/infra/http/controllers/campaign/create-campaign.controller";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export type CampaignFactoryInput = Partial<CreateCampaignControllerBody>;

export type CampaignFactoryOutput = Awaited<
  ReturnType<CampaignFactory["makeAndSaveUnique"]>
>;

@Injectable()
export class CampaignFactory {
  constructor(private readonly notion?: NotionService) {}

  async makeAndSaveUnique(override: CampaignFactoryInput = {}) {
    const input = {
      company: faker.company.name(),
      campaign: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      plannedDate: faker.date.recent().toISOString().split("T")[0],
      where: faker.lorem.sentence(),
      language: faker.lorem.sentence(),
      content: faker.lorem.sentence(),
      ...override,
    };

    const campaignCreatedResult = await this.notion?.pages.create({
      parent: { database_id: env.NOTION_MAIN_DATABASE_ID },
      properties: {
        Company: {
          title: [{ text: { content: input.company } }],
        },
        Campaign: {
          rich_text: [{ text: { content: input.campaign } }],
        },
        Description: {
          rich_text: [{ text: { content: input.description } }],
        },
        PlannedDate: {
          date: { start: input.plannedDate },
        },
        Where: {
          rich_text: [{ text: { content: input.where } }],
        },
        Language: {
          select: { name: input.language },
        },
        ...(input.content && {
          Content: {
            rich_text: [{ text: { content: input.content } }],
          },
        }),
        ...(input.imageContent && {
          "image content": {
            rich_text: [{ text: { content: input.imageContent } }],
          },
        }),
        ...(input?.images?.length && {
          Image: {
            files: input.images.map(image => ({
              name: image.name,
              external: { url: image.url },
            })),
          },
        }),
      },
    });

    return campaignCreatedResult!;
  }
}
