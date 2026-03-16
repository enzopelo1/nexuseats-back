import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { requestId?: string }>();

    const timestamp = new Date().toISOString();
    const requestId = request.requestId;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    // HttpException (erreurs Nest "classiques")
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as
        | string
        | { message?: string | string[]; error?: string };

      if (typeof res === 'string') {
        message = res;
      } else {
        message = res.message ?? message;
        error = res.error ?? error;
      }
    }

    // Erreurs Prisma
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Contrainte unique
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        error = 'Conflict';
        const target = (exception.meta?.target as string[])?.join(', ') ?? 'champ';
        message = `Un enregistrement avec cette valeur de ${target} existe déjà`;
      }
      // Record not found
      else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        error = 'Not Found';
        message = 'Enregistrement non trouvé';
      }
      // Foreign key
      else if (exception.code === 'P2003') {
        status = HttpStatus.BAD_REQUEST;
        error = 'Bad Request';
        message = 'Référence invalide';
      }
    }

    // Environnement de dev : on peut logguer l'exception complète
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('GlobalExceptionFilter:', exception);
    }

    response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        message,
        error,
        timestamp,
        path: request.url,
        requestId,
      },
    });
  }
}

