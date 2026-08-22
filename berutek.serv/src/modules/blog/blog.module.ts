import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { BlogRepository } from "./repositories/blog.repository";
import { BlogService } from "./services/blog.service";
import { BlogController } from "./controllers/blog.controller";

@Module({
    imports: [TypeOrmModule.forFeature([BlogEntity])],
    providers: [BlogRepository, BlogService],
    controllers: [BlogController],
    exports: [BlogService],
})
export class BlogModule {}
