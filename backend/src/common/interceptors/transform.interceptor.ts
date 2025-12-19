import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    statusCode: number;
    message: string;
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const req = context.switchToHttp().getRequest();
        // Bypass transformation for login to return flat token response
        if (req.url && req.url.includes('/auth/login')) {
            return next.handle();
        }

        return next.handle().pipe(
            map(data => {
                // If data already has a specific structure (like PaginatedResponse with meta), keep it nested in 'data'
                // Ideally, passing a custom message from controller would be great, but standardizing 'Success' is fine for now.
                return {
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    message: 'Success',
                    data: data,
                };
            }),
        );
    }
}
