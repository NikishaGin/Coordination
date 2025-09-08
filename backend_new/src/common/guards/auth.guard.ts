import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, context: ExecutionContext) {
        if (err || !user)
            throw err || new UnauthorizedException();

        const response = context.switchToHttp().getResponse();
        response.serviceMode = user.serviceMode;

        return user;
    }
}
