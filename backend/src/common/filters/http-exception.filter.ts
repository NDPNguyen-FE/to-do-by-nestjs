import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let exceptionResponse: any = 'Internal Server Error';
        let error = 'Internal Server Error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            exceptionResponse = exception.getResponse();
        } else if (exception instanceof SyntaxError) {
            // Handle malformed JSON body
            status = HttpStatus.BAD_REQUEST;
            exceptionResponse = 'Invalid JSON format in request body';
            error = 'Bad Request';
        } else if (exception instanceof Error) {
            // Handle generic JS errors
            exceptionResponse = exception.message || 'Internal Server Error';
            console.error('Unhandled Error:', exception.stack); // Log stack for debugging
        }

        // Default message structure
        let messageStruct = {
            id: '',
            name: 'Internal Server Error',
        };

        if (typeof exceptionResponse === 'object') {
            // Handle NestJS standard error response
            let msg = exceptionResponse.message;

            // If message is array (ValidationPipe), take the first one
            if (Array.isArray(msg) && msg.length > 0) {
                msg = msg[0];
            }

            messageStruct.name = msg || (exceptionResponse as any).error; // Use type assertion
            error = (exceptionResponse as any).error || error;
        } else {
            // Handle string response
            messageStruct.name = String(exceptionResponse);
        }

        response
            .status(status)
            .json({
                message: messageStruct,
                error: error,
                statusCode: status,
            });

        console.error(`Error ${status} at ${request.url}: `, messageStruct.name);
    }
}
