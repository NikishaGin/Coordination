import { UsersRole } from '../../generated/prisma/enums';

export interface UserPayload {
    userId: number;
    role: UsersRole;
    regionId: number | null;
}
