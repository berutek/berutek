import { Injectable } from "@nestjs/common";
import { ServiceRepository } from "../repositories/service.repository";
import { NotFoundException } from "../../../common/exceptions/notfound.exception";
import { ServiceEntity } from "../entities/service.entity";
import type { IService } from "../interfaces/service.interface";
import type { CreateServiceDto } from "../schemas/create-service.schema";
import type { UpdateServiceDto } from "../schemas/update-service.schema";

@Injectable()
export class ServiceService {

    constructor(private readonly repo: ServiceRepository) {}

    // Tags are persisted as "^tag1^,^tag2^" in a single text column
    private serializeTags(tags: string[]): string {
        return tags.map(tag => `^${tag}^`).join(',');
    }

    private parseTags(raw: string): string[] {
        if (!raw) return [];
        return raw.split(',').map(tag => tag.replace(/^\^|\^$/g, '')).filter(tag => tag.length > 0);
    }

    private toService(entity: ServiceEntity): IService {
        return { ...entity, tags: this.parseTags(entity.tags) };
    }

    async findAll(): Promise<IService[]> {
        const services = await this.repo.findAll();
        return services.map(service => this.toService(service));
    }

    async findOne(id: string): Promise<IService> {
        const service = await this.repo.findOneById(id);
        if (!service) throw new NotFoundException('Service ' + id);
        return this.toService(service);
    }

    async findAllTags(): Promise<string[]> {
        const rawTags = await this.repo.findAllTags();
        const tags = rawTags.flatMap(raw => this.parseTags(raw));
        return [...new Set(tags)];
    }

    async create(dto: CreateServiceDto): Promise<IService> {
        const { tags, ...rest } = dto;
        const created = await this.repo.create({ ...rest, tags: this.serializeTags(tags) });
        return this.toService(created);
    }

    async update(id: string, dto: UpdateServiceDto): Promise<IService> {
        await this.findOne(id);
        const { tags, ...rest } = dto;
        const data = tags !== undefined ? { ...rest, tags: this.serializeTags(tags) } : rest;
        const updated = await this.repo.update(id, data);
        return this.toService(updated);
    }

    async delete(id: string): Promise<void> {
        await this.findOne(id);
        return this.repo.delete(id);
    }
}
