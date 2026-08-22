import { Injectable } from "@nestjs/common";
import { BlogRepository } from "../repositories/blog.repository";
import { NotFoundException } from "../../../common/exceptions/notfound.exception";
import { ExistingException } from "../../../common/exceptions/existing.exception";
import type { IBlog } from "../interfaces/blog.interface";
import type { CreateBlogDto } from "../schemas/create-blog.schema";
import type { UpdateBlogDto } from "../schemas/update-blog.schema";

@Injectable()
export class BlogService {

    constructor(private readonly repo: BlogRepository) {}

    findAll(): Promise<IBlog[]> {
        return this.repo.findAll();
    }

    async findOne(id: string): Promise<IBlog> {
        const blog = await this.repo.findOneById(id);
        if (!blog) throw new NotFoundException('Blog ' + id);
        return blog;
    }

    create(dto: CreateBlogDto, createdBy: string): Promise<IBlog> {
        return this.repo.create({ ...dto, createdBy });
    }

    async update(id: string, dto: UpdateBlogDto): Promise<IBlog> {
        const current = await this.findOne(id);
        if (dto.title && dto.title !== current.title) {
            const existing = await this.repo.findOneByTitle(dto.title);
            if (existing) throw new ExistingException('Blog');
        }
        return this.repo.update(id, dto);
    }

    async delete(id: string): Promise<void> {
        await this.findOne(id);
        return this.repo.delete(id);
    }
}
