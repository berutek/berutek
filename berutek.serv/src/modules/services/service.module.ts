import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServiceEntity } from "./entities/service.entity";
import { ServiceRepository } from "./repositories/service.repository";
import { ServiceService } from "./services/service.service";
import { ServiceController } from "./controllers/service.controller";

@Module({
    imports: [TypeOrmModule.forFeature([ServiceEntity])],
    providers: [ServiceRepository, ServiceService],
    controllers: [ServiceController],
    exports: [ServiceService],
})
export class ServiceModule {}
