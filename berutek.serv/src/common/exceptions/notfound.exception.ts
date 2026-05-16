import { HttpException, HttpStatus } from "@nestjs/common";

export class NotFoundException extends HttpException {
    constructor(name: string = "") {
        super({ error: `${name} Not Found`, statusCode: HttpStatus.NOT_FOUND }, HttpStatus.NOT_FOUND);
    }
}