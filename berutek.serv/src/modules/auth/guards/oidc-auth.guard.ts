import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class OidcAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.session || !request.session.user) {
      throw new UnauthorizedException('Not authenticated');
    }

    return true;
  }
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(@Optional() private reflector?: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector?.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [];

    const request = context.switchToHttp().getRequest<Request>();

    if (!request.session || !request.session.user) {
      throw new UnauthorizedException('Not authenticated');
    }

    const userGroups: string[] = request.session.user.groups || [];
    const hasRole = requiredRoles.some((role) => userGroups.includes(role));

    if (!hasRole) {
      throw new UnauthorizedException('Insufficient permissions');
    }

    return true;
  }
}