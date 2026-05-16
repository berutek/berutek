import { Injectable } from "@nestjs/common";
import { IUser } from "../interfaces/user.interface";
import { UserRepository } from "../repositories/user.repository";
import { User } from "../entities/user.entity";
import { NotFoundException } from "../../../common/exceptions/notfound.exception";

@Injectable()
export class UserService {

    constructor(private readonly repo: UserRepository) { }

    findAll(): Promise<IUser[]> {
        return this.repo.findAll();
    }
    async findOne(id: string): Promise<IUser> {
        const user = await this.repo.findOneById(id);
        if (!user) {
            throw new NotFoundException('User ' + id);
        }
        return user;
    }
    update(id: string, user: User): Promise<IUser> {
        return this.repo.update(id, user);
    }
    delete(id: string): Promise<void> {
        return this.repo.delete(id);
    }



}