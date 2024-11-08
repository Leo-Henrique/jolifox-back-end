import { NotionService } from "@/infra/database/notion/notion.service";
import { env } from "@/infra/env";
import { extendApi } from "@anatine/zod-openapi";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodSchemaPipe } from "../../middlewares/zod-schema-pipe";

export const createCampaignControllerBodySchema = z.object({
  company: extendApi(z.string().min(1).max(255), {
    example: "Leonardo Henrique",
  }),
  campaign: extendApi(z.string().min(1).max(255), { example: "Jolifox" }),
  description: extendApi(z.string().min(1).max(255), {
    example: "Lorem Ipsum is simply dummy text.",
  }),
  plannedDate: extendApi(z.string().date(), { example: "2024-11-07" }),
  where: extendApi(z.string().min(1).max(255), { example: "Linkedin" }),
  language: extendApi(z.string().min(1).max(255), { example: "Portuguese" }),
  content: extendApi(z.string().min(1).max(255).optional(), {
    example: "Lorem Ipsum is simply dummy text.",
  }),
  imageContent: extendApi(z.string().min(1).max(255).optional(), {
    example: "A collection of cute cats!",
  }),
  images: z.array(
    z.object({
      name: extendApi(z.string().min(1).max(255), {
        example: "A very angry cat!",
      }),
      url: extendApi(z.string().url(), {
        example:
          "https://unsplash.com/pt-br/fotografias/um-close-up-de-um-gato-em-uma-cama-gz0rGe7mhL8",
      }),
    }),
  ),
});

export type CreateCampaignControllerBody = z.infer<
  typeof createCampaignControllerBodySchema
>;

@Controller()
export class CreateCampaignController {
  constructor(private readonly notion: NotionService) {}

  @ApiTags("Campaign")
  @ApiOperation({ summary: "Create a new campaign." })
  @Post("/campaign")
  @HttpCode(201)
  @ZodSchemaPipe({
    body: createCampaignControllerBodySchema,
  })
  async handle(@Body() body: CreateCampaignControllerBody) {
    const {
      company,
      campaign,
      description,
      plannedDate,
      where,
      language,
      content,
      imageContent,
      images,
    } = body;

    const campaignCreatedResult = await this.notion.pages.create({
      parent: { database_id: env.NOTION_MAIN_DATABASE_ID },
      properties: {
        Company: {
          title: [{ text: { content: company } }],
        },
        Campaign: {
          rich_text: [{ text: { content: campaign } }],
        },
        Description: {
          rich_text: [{ text: { content: description } }],
        },
        PlannedDate: {
          date: { start: plannedDate },
        },
        Where: {
          rich_text: [{ text: { content: where } }],
        },
        Language: {
          select: { name: language },
        },
        ...(content && {
          Content: {
            rich_text: [{ text: { content: content } }],
          },
        }),
        ...(imageContent && {
          "image content": {
            rich_text: [{ text: { content: imageContent } }],
          },
        }),
        ...(images.length && {
          Image: {
            files: images.map(image => ({
              name: image.name,
              external: { url: image.url },
            })),
          },
        }),
      },
    });

    return {
      id: campaignCreatedResult.id,
    };
  }
}
