import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let code = "INTERNAL_SERVER_ERROR";
    let message = "An unexpected error occurred";

    if (typeof exceptionResponse === "object" && exceptionResponse !== null) {
      const body = exceptionResponse as {
        code?: string;
        message?: string | string[];
      };

      if (body.code) {
        code = body.code;
      }

      if (typeof body.message === "string") {
        message = body.message;
      }

      if (Array.isArray(body.message)) {
        message = body.message.join(", ");
        code = "VALIDATION_ERROR";
      }
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
