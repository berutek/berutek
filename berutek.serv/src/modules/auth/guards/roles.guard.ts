import { CanActivate, ExecutionContext,  } from "@nestjs/common";
import { Reflector } from "@nestjs/core/services/reflector.service";
import { ROLES_KEY } from "../../../common/decorators/roles.decorator";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { ForbiddenException } from "../../../common/exceptions/forbidden.exception";

export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(_context:ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            _context.getHandler(),
            _context.getClass(),
        ]);
        if(!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const {user} = _context.switchToHttp().getRequest<{ user: JwtPayload }>();
        if(!user) throw new ForbiddenException('User not authenticated');

        const hasRole = requiredRoles.some((role) => user.roles.includes(role));
        if(!hasRole) throw new ForbiddenException('User does not have required roles');
        return true;
    }
}