import { NotionService } from "@/infra/database/notion/notion.service";
import { extendApi } from "@anatine/zod-openapi";
import { Controller, Delete, HttpCode, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import { ZodSchemaPipe } from "../../middlewares/zod-schema-pipe";

const deleteCampaignControllerParamsSchema = z.object({
  id: extendApi(z.string(), { example: "1370d303ccf98113bdd4dbd396f81d58" }),
});

export type DeleteCampaignControllerParams = z.infer<
  typeof deleteCampaignControllerParamsSchema
>;

@Controller()
export class DeleteCampaignController {
  constructor(private readonly notion: NotionService) {}

  @ApiTags("Campaign")
  @ApiOperation({ summary: "Delete a campaign." })
  @Delete("/campaign/:id")
  @HttpCode(204)
  @ZodSchemaPipe({
    routeParams: deleteCampaignControllerParamsSchema,
  })
  async handle(@Param() { id }: DeleteCampaignControllerParams) {
    await this.notion.pages.update({
      page_id: id,
      archived: true,
    });
  }
}
