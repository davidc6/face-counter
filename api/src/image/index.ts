import { FastifyInstance } from "fastify"
import util from 'util'
import { pipeline } from 'stream'
import fs from 'fs'
import { MultipartValue } from "@fastify/multipart"
import { on } from "events";

export default async (server: FastifyInstance) => {
    const pipe = util.promisify(pipeline)

    server.post("/", { preHandler: [server.authenticate] }, async (request, reply) => {
        try {
            const { id } = request.user
            let data = await request.file()

            let file_name = data?.filename ?? ""
            if (data) {
                const file_name_field = data.fields.file_name as MultipartValue<string>
                const split = data.filename.split('.')
                const ext = split[split.length - 1]
                file_name = `${file_name_field.value}.${ext}`
            }

            await pipe(data!.file, fs.createWriteStream(`./uploads/${file_name}`))
            const image = await server.imageService.insert(file_name)
            await server.userService.updateImage(id, image)

            if (process.env.USE_GCP === 'true') {
                // Face detection using Google Vision API
                server.imageService.countFacesGCP(file_name).catch(console.log)
            } else {
                // Face detection emulation
                server.imageService.countFacesEmulator(file_name)
            }

            return reply.status(200).send({ data: image })
        } catch (e) {
            console.log(e)
            return reply.status(400).send({ error: "Something went wrong" })
        }
    })

    server.get('/sse', async function (req, res: any) {
        res.sse(
            (async function* () {
                for await (const [event] of on(server.imageEmitter, "image-update")) {
                    yield {
                        event: event.name,
                        data: JSON.stringify(event),
                    };
                }
            })()
        )
    })
}