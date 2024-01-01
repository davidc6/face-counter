import { FastifyInstance } from "fastify";
import jwt from '@fastify/jwt';
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import { FastifyRequest } from 'fastify/types/request';
import { FastifyReply } from 'fastify/types/reply';

export const setup = (server: FastifyInstance) => {


    server.register(jwt, {
        secret: 'veryhiddensecret'
    })

    server.register(cors, {
        origin: "*",
        methods: ["POST, GET"]
    })

    server.register(multipart);

    // a lifecycle hook to execute functionality before route's handler
    server.addHook('preHandler', (req, res, next) => {
        req.jwt = server.jwt
        return next()
    })

    // extends functionality of Fastify's core objects
    server.decorate("authenticate", async (req: FastifyRequest, rep: FastifyReply) => {
        try {
            await req.jwtVerify()
        } catch (e) {
            return rep.code(401).send({ error: "This page requires authentication" })
        }
    })
}