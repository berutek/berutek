import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "../../modules/auth/interfaces/jwt-payload.interface";

export const CurrentUser = createParamDecorator((data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as JwtPayload;
    return data ? user?.[data] : user;
});