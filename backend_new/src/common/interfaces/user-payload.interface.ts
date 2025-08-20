import { Role } from '../enums/role.enum';

export interface UserPayload {
    userId: number;
    role: Role;
    regionId: number;
}
