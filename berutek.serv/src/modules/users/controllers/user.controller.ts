import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put, UseFilters, UseGuards, UsePipes } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { User } from "../entities/user.entity";
import { HttpExceptionFilter } from "../../../common/exceptions/http-exception.filter";
import type { IUser } from "../interfaces/user.interface";
import { createUserSchema } from "../schemas/create-user.schema";
import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe";
import { Public } from "../../../common/decorators/public.decorator";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UserController {
    // Controller methods will go here
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @UseGuards(JwtAuthGuard) 
    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: string) {
        return this.userService.findOne(id);
    }

    @Put(':id')
    @UsePipes(new ZodValidationPipe(createUserSchema))
    async update(@Param('id') id: string, @Body() user: User) {
        return this.userService.update(id, user);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.userService.delete(id);
    }
}