import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Session, UseFilters, UseGuards, UsePipes } from "@nestjs/common";
import type { SessionData } from "express-session";
import { BlogService } from "../services/blog.service";
import { HttpExceptionFilter } from "../../../common/exceptions/http-exception.filter";
import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe";
import { createBlogSchema, type CreateBlogDto } from "../schemas/create-blog.schema";
import { updateBlogSchema, type UpdateBlogDto } from "../schemas/update-blog.schema";
import { Roles } from "../../auth/decorators/roles.decorator";
import { RoleGuard } from "../../auth/guards/oidc-auth.guard";

@Controller('blogs')
@UseFilters(HttpExceptionFilter)
export class BlogController {

    constructor(private readonly blogService: BlogService) {}

    @Get()
    findAll() {
        return this.blogService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
        return this.blogService.findOne(id);
    }

    @Post()
    @Roles('admin')
    @UseGuards(RoleGuard)
    @UsePipes(new ZodValidationPipe(createBlogSchema))
    create(@Body() dto: CreateBlogDto, @Session() session: SessionData) {
        return this.blogService.create(dto, session.user!.id);
    }

    @Patch(':id')
    @Roles('admin')
    @UseGuards(RoleGuard)
    update(
        @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string,
        @Body(new ZodValidationPipe(updateBlogSchema)) dto: UpdateBlogDto,
    ) {
        return this.blogService.update(id, dto);
    }

    @Delete(':id')
    @Roles('admin')
    @UseGuards(RoleGuard)
    delete(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
        return this.blogService.delete(id);
    }
}
