import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, url, body, query, params } = req;
        const now = Date.now();

        // Sanitize body for logging (hide password)
        const sanitizedBody = body ? { ...body } : {};
        if (sanitizedBody.password) sanitizedBody.password = '******';
        if (sanitizedBody.file) sanitizedBody.file = '[Binary File]'; // Avoid logging file buffer

        this.logger.log(`Incoming Request: ${method} ${url} | Query: ${JSON.stringify(query)} | Params: ${JSON.stringify(params)} | Body: ${JSON.stringify(sanitizedBody)}`);

        return next
            .handle()
            .pipe(
                tap((data) => {
                    const res = context.switchToHttp().getResponse();
                    // Truncate large responses to prevent memory issues
                    let responseLog = JSON.stringify(data);
                    if (responseLog && responseLog.length > 500) {
                        responseLog = responseLog.slice(0, 500) + '... [TRUNCATED]';
                    }
                    this.logger.log(
                        `Request Completed: ${method} ${url} ${res.statusCode} ${Date.now() - now}ms | Response: ${responseLog}`,
                    );
                }),
            );
    }
}
