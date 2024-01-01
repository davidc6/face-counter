import { build } from "./app"

const server = build();

// Graceful shutdown
const listeners = ['SIGINT', 'SIGTERM']
listeners.forEach((signal) => {
    process.on(signal, async () => {
        await server.close()
        process.exit(0)
    })
})

server.listen({ host: 'localhost', port: 8000 }, (err, address) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    console.log(`Server listening at ${address}`)
});
