import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import {ExtractJwt, Strategy} from 'passport-jwt';
import { User } from "../../users/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { UnauthorizedException } from "../../../common/exceptions/unauthorized.exception";

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // Verify user still exists and is active. This protects against
    // tokens issued before a user is deactivated.
    const user = await this.userRepo.findOne({
      where: { id: payload.sub, isDeleted: false },
    });
    if (!user) throw new UnauthorizedException('User not found or inactive');
    return payload;
  }
}