import { FastifyInstance, FastifyReply } from "fastify"
import { JWTPayload, Roles } from "../types";

export default async (server: FastifyInstance) => {
    server.post<{ Body: { email: string } }>('/sign-up', async (request, reply: FastifyReply) => {
        const email = request.body?.email;
        if (!email) {
            reply.code(421).send({ error: 'Missing email address' })
        }

        const user = await server.userService.search(email)
        if (user && user.role !== Roles.Admin) {
            reply.code(408).send({ error: 'Email already exists' });
        }

        const jwtPayload: JWTPayload = {
            id: email,
            role: Roles.User
        }
        const token = request.jwt.sign(jwtPayload, { expiresIn: '30m' });

        await server.userService.register(email)

        reply.status(200).send({ data: { token } })
    })

    server.get('/', { preHandler: [server.authenticate] }, async (request, reply) => {
        const { id } = request.user;

        const user = await server.userService.search(id)

        reply.status(200).send({ data: user })
    })
}
