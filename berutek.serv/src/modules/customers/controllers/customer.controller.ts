import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put, UseFilters, UseGuards, UsePipes } from "@nestjs/common";
import { CustomerService } from "../services/customer.service";
import { HttpExceptionFilter } from "../../../common/exceptions/http-exception.filter";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe";
import { createCustomerSchema, type CreateCustomerDto } from "../schemas/create-customer.schema";
import { updateCustomerSchema, type UpdateCustomerDto } from "../schemas/update-customer.schema";

@Controller('customers')
@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
export class CustomerController {

    constructor(private readonly customerService: CustomerService) {}

    @Get()
    findAll() {
        return this.customerService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
        return this.customerService.findOne(id);
    }

    @Post()
    @UsePipes(new ZodValidationPipe(createCustomerSchema))
    create(@Body() dto: CreateCustomerDto) {
        return this.customerService.create(dto);
    }

    @Put(':id')
    @UsePipes(new ZodValidationPipe(updateCustomerSchema))
    update(
        @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string,
        @Body() dto: UpdateCustomerDto,
    ) {
        return this.customerService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
        return this.customerService.delete(id);
    }
}
