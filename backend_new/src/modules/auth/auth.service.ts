import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { LoginDto } from './auth.dto';
import { UserPayload } from '../../common/interfaces/user-payload.interface';
import {UsersRole} from "../../generated/prisma/enums";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    private validatePassword(password: string, passwordHash: string): Promise<boolean> {
        const hash = passwordHash.replace(/^\$2y\$/, '$2a$');
        return bcrypt.compare(password, hash);
    }

    async login(loginData: LoginDto): Promise<{
        error?: string;
        serviceMode?: string;
        data?: {
            user: UserPayload;
            token: string;
        };
    }> {
        const userData = await this.prisma.users.findUnique({
            where: { login: loginData.login },
            select: {
                id: true,
                passwordHash: true,
                role: true,
                regionId: true,
            },
        });
        if (!userData) return { error: 'Пользователя с таким логином не существует' };

        const settings = await this.prisma.settings.findFirst({
            select: { serviceMode: true },
        });
        if ((userData.role !== UsersRole.ADMIN) && settings?.serviceMode)
            return { serviceMode: 'Сервис временно недоступен' };

        const isValidPassword: boolean = await this.validatePassword(
            loginData.password,
            userData.passwordHash,
        );
        if (!isValidPassword) return { error: 'Неверный пароль' };

        const payload: UserPayload = {
            userId: userData.id,
            role: userData.role,
            regionId: userData.regionId,
        };
        const token = this.jwtService.sign(payload);
        if (!token)
            return { error: 'Не удалось сгенерировать JWT токен' };

        return {
            data: {
                user: payload,
                token,
            },
        };
    }

    toggleServiceMode() {
        return this.prisma.$queryRaw(
            Prisma.sql`
            UPDATE settings
            SET serviceMode = NOT serviceMode 
            WHERE id = 1
            `,
        );
    }
}
