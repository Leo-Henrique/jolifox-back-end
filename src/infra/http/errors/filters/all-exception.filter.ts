import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { APIResponseError } from "@notionhq/client";
import { FastifyReply } from "fastify";
import { InternalServerError } from "../internal-server.error";
import { NotionServiceError } from "../notion-service.error";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    let httpError: HttpException;

    if (exception instanceof HttpException) httpError = exception;
    else if (exception instanceof APIResponseError) {
      httpError = new NotionServiceError(exception);
    } else {
      const debugFromUnknownError =
        exception && typeof exception === "object" && "message" in exception
          ? exception.message
          : null;

      httpError = new InternalServerError(debugFromUnknownError);
      console.error(httpError);
    }

    response.status(httpError.getStatus()).send(httpError.getResponse());
  }
}
