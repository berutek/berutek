import { Injectable, Optional } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { create } from "domain";
import { NotFoundException } from "../../../common/exceptions/notfound.exception";

@Injectable()
export class UserRepository {
    // Repository methods will go here
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
    ){}

    findAll(): Promise<User[]> {
        return this.repo.find({where: {isDeleted: false}});
    }

    async findOneById(id: string): Promise<User|null> {
        return await this.repo.findOne({ where: { id, isDeleted: false } })
    }

    async findOneByEmail(email: string): Promise<User|null> {
        return await this.repo.findOne({ where: { email, isDeleted: false } });
    }

    create(user: User): Promise<User> {
        const newUser = this.repo.create(user);
        return this.repo.save(newUser);
    }

    async update(id: string, user: User): Promise<User> {
        await this.repo.update(id, user);
        return await this.findOneById(id) || Promise.reject(new NotFoundException('User '+id));
    }

    async delete(id: string): Promise<void> {
        await this.repo.update(id, { isDeleted: true });
    }
}