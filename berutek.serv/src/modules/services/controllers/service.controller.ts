import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UseFilters, UseGuards, UsePipes } from "@nestjs/common";
import { ServiceService } from "../services/service.service";
import { HttpExceptionFilter } from "../../../common/exceptions/http-exception.filter";
import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe";
import { createServiceSchema, type CreateServiceDto } from "../schemas/create-service.schema";
import { updateServiceSchema, type UpdateServiceDto } from "../schemas/update-service.schema";
import { Roles } from "../../auth/decorators/roles.decorator";
import { OidcAuthGuard, RoleGuard } from "../../auth/guards/oidc-auth.guard";

@Controller('services')
@UseFilters(HttpExceptionFilter)
export class ServiceController {

    constructor(private readonly serviceService: ServiceService) {}

    @Get()
    findAll() {
        return this.serviceService.findAll();
    }

    // Must be declared before ':id' so 'tags' is not matched as an id
    @Get('tags')
    findAllTags() {
        return this.serviceService.findAllTags();
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
        return this.serviceService.findOne(id);
    }

    @Post()
    @Roles('admin')
    @UseGuards(RoleGuard)
    @UsePipes(new ZodValidationPipe(createServiceSchema))
    create(@Body() dto: CreateServiceDto) {
        return this.serviceService.create(dto);
    }

    @Patch(':id')
    @Roles('admin')
    @UseGuards(RoleGuard)
    update(
        @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string,
        @Body(new ZodValidationPipe(updateServiceSchema)) dto: UpdateServiceDto,
    ) {
        return this.serviceService.update(id, dto);
    }

    @Delete(':id')
    @Roles('admin')
    @UseGuards(RoleGuard)
    delete(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
        return this.serviceService.delete(id);
    }
}
