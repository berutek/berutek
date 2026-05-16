import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { ZodType } from "zod";
import { BadRequestException } from "../exceptions/bad-request.exception";

export class ZodValidationPipe implements PipeTransform {

    constructor(private schema: ZodType) { }

    transform(value: unknown, _metadata: ArgumentMetadata) {
        const result = this.schema.safeParse(value);
        if (!result.success) {
            const details = result.error.issues.map((issue) => ({
                field: issue.path.join('.') || 'root',
                message: issue.message,
            }));
            throw new BadRequestException(details);
        }
        return result.data;
    }
}
