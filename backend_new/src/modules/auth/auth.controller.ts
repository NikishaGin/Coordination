import {Body, Controller, Post, UseGuards, UnauthorizedException, ServiceUnavailableException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserPayload } from '../../common/interfaces/user-payload.interface';
import { LoginDto } from './auth.dto';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UsersRole } from '../../generated/prisma/enums';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginData: LoginDto): Promise<{ user: UserPayload; token: string }> {
        const { error, serviceMode, data } = await this.authService.login(loginData);

        if (serviceMode)
            throw new ServiceUnavailableException(serviceMode);

        if (error || !data)
            throw new UnauthorizedException(error || 'Ошибка авторизации');

        return data;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UsersRole.ADMIN)
    @Post('toggle-service-mode')
    toggleServiceMode() {
        return this.authService.toggleServiceMode();
    }
}
