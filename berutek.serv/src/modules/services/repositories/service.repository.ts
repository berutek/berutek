import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ServiceEntity } from "../entities/service.entity";
import { NotFoundException } from "../../../common/exceptions/notfound.exception";
import { ExistingException } from "../../../common/exceptions/existing.exception";

@Injectable()
export class ServiceRepository {

    constructor(
        @InjectRepository(ServiceEntity)
        private readonly repo: Repository<ServiceEntity>,
    ) {}

    findAll(): Promise<ServiceEntity[]> {
        return this.repo.find({ where: { isDeleted: false } });
    }

    async findOneById(id: string): Promise<ServiceEntity | null> {
        return this.repo.findOne({ where: { id, isDeleted: false } });
    }

    async findOneByName(name: string): Promise<ServiceEntity | null> {
        return this.repo.findOne({ where: { name, isDeleted: false } });
    }

    async findAllTags(): Promise<string[]> {
        const rows = await this.repo.find({ where: { isDeleted: false }, select: ['tags'] });
        return rows.map(row => row.tags);
    }

    async create(data: Partial<ServiceEntity>): Promise<ServiceEntity> {
        const existing = await this.findOneByName(data.name!);
        if (existing) throw new ExistingException('Service');
        const service = this.repo.create(data);
        return this.repo.save(service);
    }

    async update(id: string, data: Partial<ServiceEntity>): Promise<ServiceEntity> {
        await this.repo.update(id, data);
        return await this.findOneById(id) ?? Promise.reject(new NotFoundException('Service ' + id));
    }

    async delete(id: string): Promise<void> {
        await this.repo.update(id, { isDeleted: true });
    }
}
