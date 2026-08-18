import { Module } from "@nestjs/common";
import { Lead } from "./entities/lead.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LeadService } from "./services/lead.service";
import { LeadController } from "./controller/lead.controller";
import { RoleGuard } from "../auth/guards/oidc-auth.guard";

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead]),
  ],
  controllers: [LeadController],
  providers: [LeadService, RoleGuard],
  exports: [LeadService],
})
export class LeadModule {}