import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { NotFoundException } from "../../../common/exceptions/notfound.exception";
import { Repository } from "typeorm";

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private readonly repo: Repository<User>) { }

    async findOrCreateUser(userinfo: any): Promise<User> {
        const username = userinfo.preferred_username;

        let user = await this.repo.findOne({
            where: { username },
        });

        if (!user) {
            // Create new user from Authelia userinfo
            user = this.repo.create({
                username,
                email: userinfo.email,
                displayname: userinfo.name,
                groups: userinfo.groups || [],
                authelia_sub: userinfo.sub,
            });
            await this.repo.save(user);
        } else {
            // Update existing user with latest info from Authelia
            user.email = userinfo.email;
            user.displayname = userinfo.name;
            user.groups = userinfo.groups || [];
            user.authelia_sub = userinfo.sub;
            await this.repo.save(user);
        }

        return user;
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.repo.findOne({ where: { username } });
    }

    async findById(id: string): Promise<User | null> {
        return this.repo.findOne({ where: { id } });
    }

    // findAll(): Promise<IUser[]> {
    //     return this.repo.findAll();
    // }
    // async findOne(id: string): Promise<IUser> {
    //     const user = await this.repo.findOneById(id);
    //     if (!user) {
    //         throw new NotFoundException('User ' + id);
    //     }
    //     return user;
    // }
    // update(id: string, user: User): Promise<IUser> {
    //     return this.repo.update(id, user);
    // }
    // delete(id: string): Promise<void> {
    //     return this.repo.delete(id);
    // }



}