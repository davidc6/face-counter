import fastify, { FastifyInstance } from 'fastify'
import jwt from '@fastify/jwt';
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import { FastifyRequest } from 'fastify/types/request';
import { FastifyReply } from 'fastify/types/reply';
import fp from 'fastify-plugin'
import { FastifySSEPlugin } from "fastify-sse-v2";
import { EventEmitter } from "events";
import { UserService } from './user/service';
import { ImageService } from './image/service';
import user from './user'
import image from './image'

const decorateInstance = async (server: FastifyInstance) => {
    const user = new Map<string, Record<string, any>>()
    const userService = new UserService(user)
    server.decorate('userService', userService)

    const imageEmitter = new EventEmitter();
    server.decorate('imageEmitter', imageEmitter)

    const images = new Map<string, Record<string, any>>()
    const imageService = new ImageService(images, imageEmitter)
    server.decorate('imageService', imageService)
}

declare module 'fastify' {
    interface FastifyInstance {
        userService: UserService,
        imageService: ImageService
        imageEmitter: EventEmitter
    }
}

export const build = () => {
    const server = fastify()

    // register plugins
    server.register(jwt, {
        secret: 'veryhiddensecret' // Should be part of .env, here just for demo purposes
    })
    server.register(cors, {
        origin: "*",
        methods: ["POST, GET"]
    })
    server.register(multipart);
    server.register(FastifySSEPlugin);

    // add a lifecycle hook to execute functionality before route's handler
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

    // register depedencies
    server.register(fp(decorateInstance))

    // register routes
    server.register(user, { prefix: "/api/user" })
    server.register(image, { prefix: "/api/images" })

    return server
}