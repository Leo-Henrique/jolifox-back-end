import { NotionService } from "@/infra/database/notion/notion.service";
import { extendApi } from "@anatine/zod-openapi";
import { Body, Controller, HttpCode, Param, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodSchemaPipe } from "../../middlewares/zod-schema-pipe";
import { createCampaignControllerBodySchema } from "./create-campaign.controller";

const updateCampaignControllerParamsSchema = z.object({
  id: extendApi(z.string(), { example: "1370d303ccf98113bdd4dbd396f81d58" }),
});

const updateCampaignControllerBodySchema =
  createCampaignControllerBodySchema.partial();

export type UpdateCampaignControllerParams = z.infer<
  typeof updateCampaignControllerParamsSchema
>;

export type UpdateCampaignControllerBody = z.infer<
  typeof updateCampaignControllerBodySchema
>;

@Controller()
export class UpdateCampaignController {
  constructor(private readonly notion: NotionService) {}

  @ApiTags("Campaign")
  @ApiOperation({ summary: "Update a campaign." })
  @Put("/campaign/:id")
  @HttpCode(204)
  @ZodSchemaPipe({
    routeParams: updateCampaignControllerParamsSchema,
    body: updateCampaignControllerBodySchema,
  })
  async handle(
    @Param() { id }: UpdateCampaignControllerParams,
    @Body() body: UpdateCampaignControllerBody,
  ) {
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

    await this.notion.pages.update({
      page_id: id,
      properties: {
        ...(company && {
          Company: {
            title: [{ text: { content: company } }],
          },
        }),
        ...(campaign && {
          Campaign: {
            rich_text: [{ text: { content: campaign } }],
          },
        }),
        ...(description && {
          Description: {
            rich_text: [{ text: { content: description } }],
          },
        }),
        ...(plannedDate && {
          PlannedDate: {
            date: { start: plannedDate },
          },
        }),
        ...(where && {
          Where: {
            rich_text: [{ text: { content: where } }],
          },
        }),
        ...(language && {
          Language: {
            select: { name: language },
          },
        }),
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
        ...(images && {
          Image: {
            files: images.map(image => ({
              name: image.name,
              external: { url: image.url },
            })),
          },
        }),
      },
    });
  }
}
