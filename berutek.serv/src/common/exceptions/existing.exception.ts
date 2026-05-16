import { HttpException, HttpStatus } from "@nestjs/common";

export class ExistingException extends HttpException {
    constructor(resource: string = "") {
        super({ error: `${resource} already exists`, status: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST);
    }
}