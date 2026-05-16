import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CustomerEntity } from "../entities/customer.entity";
import { NotFoundException } from "../../../common/exceptions/notfound.exception";
import { ExistingException } from "../../../common/exceptions/existing.exception";
import type { CreateCustomerDto } from "../schemas/create-customer.schema";
import type { UpdateCustomerDto } from "../schemas/update-customer.schema";

@Injectable()
export class CustomerRepository {

    constructor(
        @InjectRepository(CustomerEntity)
        private readonly repo: Repository<CustomerEntity>,
    ) {}

    findAll(): Promise<CustomerEntity[]> {
        return this.repo.find({ where: { isDeleted: false } });
    }

    async findOneById(id: string): Promise<CustomerEntity | null> {
        return this.repo.findOne({ where: { id, isDeleted: false } });
    }

    async findOneByEmail(email: string): Promise<CustomerEntity | null> {
        return this.repo.findOne({ where: { email, isDeleted: false } });
    }

    async create(dto: CreateCustomerDto): Promise<CustomerEntity> {
        const existing = await this.findOneByEmail(dto.email);
        if (existing) throw new ExistingException('Customer');
        const customer = this.repo.create(dto);
        return this.repo.save(customer);
    }

    async update(id: string, dto: UpdateCustomerDto): Promise<CustomerEntity> {
        await this.repo.update(id, dto);
        return await this.findOneById(id) ?? Promise.reject(new NotFoundException('Customer ' + id));
    }

    async delete(id: string): Promise<void> {
        await this.repo.update(id, { isDeleted: true });
    }
}
