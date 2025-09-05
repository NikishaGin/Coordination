import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from '../common/interfaces/user-payload.interface';
import { UsersRole } from "../generated/prisma/enums";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private prisma: PrismaService,
        configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') as string,
        });
    }

    async validate(payload: UserPayload): Promise<UserPayload> {
        if (payload.role !== UsersRole.ADMIN) {
            const serviceMode = await this.prisma.settings.findFirst({
                select: {serviceMode: true},
            });
            if (serviceMode)
                throw new ServiceUnavailableException('Сервис недоступен: включён сервисный режим');
        }
        return payload;
    }
}
