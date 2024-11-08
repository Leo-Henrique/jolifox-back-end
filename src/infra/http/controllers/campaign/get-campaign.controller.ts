import { NotionService } from "@/infra/database/notion/notion.service";
import { extendApi } from "@anatine/zod-openapi";
import { Controller, Get, HttpCode, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodSchemaPipe } from "../../middlewares/zod-schema-pipe";

const getCampaignControllerParamsSchema = z.object({
  id: extendApi(z.string(), { example: "1370d303ccf98113bdd4dbd396f81d58" }),
});

export type GetCampaignControllerParams = z.infer<
  typeof getCampaignControllerParamsSchema
>;

@Controller()
export class GetCampaignController {
  constructor(private readonly notion: NotionService) {}

  @ApiTags("Campaign")
  @ApiOperation({ summary: "Get a campaign." })
  @Get("/campaign/:id")
  @HttpCode(200)
  @ZodSchemaPipe({
    routeParams: getCampaignControllerParamsSchema,
  })
  async handle(@Param() { id }: GetCampaignControllerParams) {
    const campaign = await this.notion.pages.retrieve({
      page_id: id,
    });

    return { campaign };
  }
}
