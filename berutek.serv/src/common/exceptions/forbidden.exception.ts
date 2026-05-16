import { HttpException, HttpStatus } from "@nestjs/common";

export class ForbiddenException extends HttpException {
    constructor(resource: string) {
        super({ error: `${resource} access forbidden`, status: HttpStatus.FORBIDDEN }, HttpStatus.FORBIDDEN);
    }
}