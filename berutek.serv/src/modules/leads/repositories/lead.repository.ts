import { InjectRepository } from "@nestjs/typeorm";
import { Lead } from "../entities/lead.entity";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { NotFoundException } from "../../../common/exceptions/notfound.exception";
import { Repository } from "typeorm";

@Injectable()
export class LeadRepository {
    constructor(
        @InjectRepository(Lead)
        private readonly repo: Repository<Lead>,
    ){}

    findAll(): Promise<Lead[]> {
        return this.repo.find();
    }

    async findOneById(uuid: string): Promise<Lead|null> {
        return await this.repo.findOne({ where: { uuid } })
    }

    create(lead: Lead): Promise<Lead> {
        const newLead = this.repo.create(lead);
        return this.repo.save(newLead);
    }

    async update(uuid: string, lead: Lead): Promise<Lead> {
        await this.repo.update(uuid, lead);
        return await this.findOneById(uuid) || Promise.reject(new NotFoundException('Lead '+uuid));
    }

    async delete(uuid: string): Promise<void> {
        await this.repo.delete(uuid);
    }
}