import { ErrorPresenter } from "@/infra/presenters/error.presenter";
import { HttpException } from "@nestjs/common";

export class NotionServiceError extends HttpException {
  static readonly statusCode = 502;
  static readonly error = "NOTION_SERVICE_ERROR";
  static readonly message = "Desculpe, recebemos um erro inesperado do Notion.";

  constructor(debug: unknown) {
    super(
      ErrorPresenter.toHttp(NotionServiceError.statusCode, {
        ...NotionServiceError,
        debug,
      }),
      NotionServiceError.statusCode,
    );
  }
}
