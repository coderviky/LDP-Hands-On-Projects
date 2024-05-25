import Fastify from 'fastify'


// create fastify server with logger enabled with pino
const app = Fastify({
    logger: true
})



// define a route 
app.get('/', (request, reply) => {
    reply.send("Hello World")
})


// start server
app.listen({ port: 3000 }, (error, address) => {
    if (error) {
        app.log.error(error);
        process.exit(1);
    }

    console.log(`Server listening at ${address}`)
})
