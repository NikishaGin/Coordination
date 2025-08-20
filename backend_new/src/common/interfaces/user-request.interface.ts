import { FastifyRequest } from 'fastify';
import { UserPayload } from './user-payload.interface';

export interface AuthenticatedRequest extends FastifyRequest {
    user: UserPayload;
}
