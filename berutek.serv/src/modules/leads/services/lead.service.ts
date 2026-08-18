import { Injectable } from "@nestjs/common";
import { Lead } from "../entities/lead.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class LeadService {
    constructor(@InjectRepository(Lead) private readonly leadRepository: Repository<Lead>) {}

    async getAllLeads(): Promise<Lead[]> {
        return this.leadRepository.find();
    }

    async getLeadById(uuid: string): Promise<Lead | null> {
        return this.leadRepository.findOneBy({ uuid });
    }

    async createLead(lead: Lead): Promise<Lead> {
        return this.leadRepository.save(lead);
    }

    async updateLead(uuid: string, lead: Lead): Promise<Lead | null> {
        await this.leadRepository.update(uuid, lead);
        return this.leadRepository.findOneBy({ uuid });
    }

    async deleteLead(uuid: string): Promise<void> {
        await this.leadRepository.delete(uuid);
    }
}