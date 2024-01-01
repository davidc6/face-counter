import { JWT } from '@fastify/jwt'

declare module 'fastify' {
    interface FastifyRequest {
        jwt: JWT
    }
    export interface FastifyInstance {
        authenticate: any
    }
}

type UserPayload = {
    id: string,
    role: string
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: UserPayload
    }
}

export enum Roles {
    Admin = "admin",
    User = "user"
}

export type JWTPayload = {
    id: string,
    role: Roles
}

export enum JobStatus {
    Enqueued = "Enqueued",
    Progess = "Progress",
    Complete = "Complete"
}
