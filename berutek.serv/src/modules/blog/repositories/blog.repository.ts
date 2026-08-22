import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BlogEntity } from "../entities/blog.entity";
import { NotFoundException } from "../../../common/exceptions/notfound.exception";
import { ExistingException } from "../../../common/exceptions/existing.exception";

@Injectable()
export class BlogRepository {

    constructor(
        @InjectRepository(BlogEntity)
        private readonly repo: Repository<BlogEntity>,
    ) {}

    findAll(): Promise<BlogEntity[]> {
        return this.repo.find({ where: { isDeleted: false }, order: { createdAt: 'DESC' } });
    }

    async findOneById(id: string): Promise<BlogEntity | null> {
        return this.repo.findOne({ where: { id, isDeleted: false } });
    }

    async findOneByTitle(title: string): Promise<BlogEntity | null> {
        return this.repo.findOne({ where: { title, isDeleted: false } });
    }

    async create(data: Partial<BlogEntity>): Promise<BlogEntity> {
        const existing = await this.findOneByTitle(data.title!);
        if (existing) throw new ExistingException('Blog');
        const blog = this.repo.create(data);
        return this.repo.save(blog);
    }

    async update(id: string, data: Partial<BlogEntity>): Promise<BlogEntity> {
        await this.repo.update(id, data);
        return await this.findOneById(id) ?? Promise.reject(new NotFoundException('Blog ' + id));
    }

    async delete(id: string): Promise<void> {
        await this.repo.update(id, { isDeleted: true });
    }
}
