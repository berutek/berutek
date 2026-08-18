import { Body, Controller, Delete, Get, NotFoundException, Param, Post, UseGuards } from "@nestjs/common";
import { LeadService } from "../services/lead.service";
import { Lead } from "../entities/lead.entity";
import { RoleGuard } from "../../auth/guards/oidc-auth.guard";
import { Roles } from "../../auth/decorators/roles.decorator";

@Controller('leads')
export class LeadController {

    constructor(private readonly leadService: LeadService) {}

    @Post()
    async createLead(@Body() lead: Lead) {
        return this.leadService.createLead(lead);
    }

    @Get(':uuid')
    @Roles('admin')
    @UseGuards(RoleGuard)
    async getLeadById(@Param('uuid') uuid: string) {
        const lead = await this.leadService.getLeadById(uuid);
        if (!lead) throw new NotFoundException(`Lead ${uuid} not found`);
        return lead;
    }

    @Get()
    @Roles('admin')
    @UseGuards(RoleGuard)
    async getAllLeads() {
        return this.leadService.getAllLeads();
    }

    @Delete(':uuid')
    async deleteLead(@Param('uuid') uuid: string) {
        return this.leadService.deleteLead(uuid);
    }
}