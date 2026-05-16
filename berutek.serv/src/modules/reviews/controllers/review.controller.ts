import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put, UseFilters, UseGuards, UsePipes } from "@nestjs/common";
import { ReviewService } from "../services/review.service";
import { HttpExceptionFilter } from "../../../common/exceptions/http-exception.filter";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe";
import { createReviewSchema, type CreateReviewDto } from "../schemas/create-review.schema";
import { updateReviewSchema, type UpdateReviewDto } from "../schemas/update-review.schema";

@Controller('reviews')
@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
export class ReviewController {

    constructor(private readonly reviewService: ReviewService) {}

    @Get()
    findAll() {
        return this.reviewService.findAll();
    }

    @Get('customer/:customerId')
    findByCustomer(
        @Param('customerId', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) customerId: string,
    ) {
        return this.reviewService.findByCustomerId(customerId);
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
        return this.reviewService.findOne(id);
    }

    @Post()
    @UsePipes(new ZodValidationPipe(createReviewSchema))
    create(@Body() dto: CreateReviewDto) {
        return this.reviewService.create(dto);
    }

    @Put(':id')
    @UsePipes(new ZodValidationPipe(updateReviewSchema))
    update(
        @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string,
        @Body() dto: UpdateReviewDto,
    ) {
        return this.reviewService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
        return this.reviewService.delete(id);
    }
}
