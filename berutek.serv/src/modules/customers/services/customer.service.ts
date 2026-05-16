import { Injectable } from "@nestjs/common";
import { CustomerRepository } from "../repositories/customer.repository";
import { NotFoundException } from "../../../common/exceptions/notfound.exception";
import type { ICustomer } from "../interfaces/customer.interface";
import type { CreateCustomerDto } from "../schemas/create-customer.schema";
import type { UpdateCustomerDto } from "../schemas/update-customer.schema";

@Injectable()
export class CustomerService {

    constructor(private readonly repo: CustomerRepository) {}

    findAll(): Promise<ICustomer[]> {
        return this.repo.findAll();
    }

    async findOne(id: string): Promise<ICustomer> {
        const customer = await this.repo.findOneById(id);
        if (!customer) throw new NotFoundException('Customer ' + id);
        return customer;
    }

    create(dto: CreateCustomerDto): Promise<ICustomer> {
        return this.repo.create(dto);
    }

    async update(id: string, dto: UpdateCustomerDto): Promise<ICustomer> {
        await this.findOne(id);
        return this.repo.update(id, dto);
    }

    async delete(id: string): Promise<void> {
        await this.findOne(id);
        return this.repo.delete(id);
    }
}
