import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {UserController} from "./controllers/user.controller.old";
import {UserService} from "./services/user.service";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService],
    exports: [TypeOrmModule, UserService],
})
export class UserModule {}