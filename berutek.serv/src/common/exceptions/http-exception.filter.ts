import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        response.status(status).json({
            statusCode: status,
            error: exceptionResponse['error'] || exception.message,
            ...(exceptionResponse['details'] && { details: exceptionResponse['details'] }),
            timestamp: new Date().toISOString(),
            path: request.url,
        });
        console.error(`[${request.method} ${status}] ${request.headers['host']}${request['originalUrl']} - ${exceptionResponse['error'] || exception.message}`);
    }

}