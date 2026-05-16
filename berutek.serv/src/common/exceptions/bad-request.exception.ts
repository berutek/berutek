import { HttpException, HttpStatus } from "@nestjs/common";

interface ValidationDetail {
    field: string;
    message: string;
}

export class BadRequestException extends HttpException {
    constructor(details: ValidationDetail[] = []) {
        super(
            { error: 'Bad Request', statusCode: HttpStatus.BAD_REQUEST, details },
            HttpStatus.BAD_REQUEST,
        );
    }
}
