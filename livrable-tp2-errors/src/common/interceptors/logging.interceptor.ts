import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request & { requestId?: string }>();
    const response = ctx.getResponse<Response>();

    const { method, url } = request as any;

    // Générer un requestId si absent
    const requestId = request.requestId ?? uuidv4();
    (request as any).requestId = requestId;
    (response as any).setHeader?.('x-request-id', requestId);

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        const message = `${method} ${url} - ${delay}ms - requestId=${requestId}`;

        if (delay > 1000) {
          this.logger.warn(message);
        } else {
          this.logger.log(message);
        }
      }),
    );
  }
}

