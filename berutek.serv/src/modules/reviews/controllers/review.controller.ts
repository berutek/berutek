import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put, UseFilters, UseGuards, UsePipes } from "@nestjs/common";
import { ReviewService } from "../services/review.service";
import { HttpExceptionFilter } from "../../../common/exceptions/http-exception.filter";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe";
import { createReviewSchema, type CreateReviewDto } from "../schemas/create-review.schema";
import { updateReviewSchema, type UpdateReviewDto } from "../schemas/update-review.schema";
import { Public } from "../../../common/decorators/public.decorator";

@Controller('reviews')
@UseFilters(HttpExceptionFilter)
export class ReviewController {

    constructor(private readonly reviewService: ReviewService) {}

    @Get()
    @Public()
    findAll() {
        return this.reviewService.findAll();
    }

    @Get('customer/:customerId')
    @Public()
    findByCustomer(
        @Param('customerId', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) customerId: string,
    ) {
        return this.reviewService.findByCustomerId(customerId);
    }

    @Get(':id')
    @Public()
    findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
        return this.reviewService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ZodValidationPipe(createReviewSchema))
    create(@Body() dto: CreateReviewDto) {
        return this.reviewService.create(dto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ZodValidationPipe(updateReviewSchema))
    update(
        @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string,
        @Body() dto: UpdateReviewDto,
    ) {
        return this.reviewService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    delete(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
        return this.reviewService.delete(id);
    }
}
