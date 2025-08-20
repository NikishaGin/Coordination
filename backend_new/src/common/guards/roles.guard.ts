import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedRequest } from '../interfaces/auth-request.interface';
import { Role } from '../enums/role.enum';

export const ROLE_HIERARCHY: Record<Role, number> = {
    [Role.ADMIN]: 6,
    [Role.CHIEF_MODERATOR]: 5,
    [Role.MODERATOR_PRD]: 4,
    [Role.MANAGER_PRD]: 3,
    [Role.APPROVER_MIUDOL]: 2,
    [Role.ANALYST_CA]: 1,
    [Role.OBSERVER]: 0,
};

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) return true;

        const { user } = context
            .switchToHttp()
            .getRequest<AuthenticatedRequest>();

        if (!user?.role)
            throw new ForbiddenException('Неавторизованный доступ');









        const userRoleCode = user.roleTypeCode;
        const userRoleLevel = ROLE_HIERARCHY[userRoleCode];

        const hasAccess = requiredRoles.some((role) => {
            const requiredRoleLevel = ROLE_HIERARCHY[role];
            return userRoleLevel >= requiredRoleLevel;
        });

        if (!hasAccess) {
            throw new ForbiddenException(
                'Недостаточно прав для выполнения операции',
            );
        }

        return true;
    }
}
