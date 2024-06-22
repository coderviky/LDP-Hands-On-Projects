// // SETUP for common jwt token and mongo connection

// import supertest from "supertest";
// import mongoose from "mongoose";
// import { createFastifyApp } from "../../src/server";

// const app = createFastifyApp();

// let token = '';

// // 

// // before all and after all hooks
// beforeAll(async () => {
//     // connect mongoose to the test database by using the global process.env.MONGO_URI
//     await mongoose.connect(process.env['MONGO_URI'] as string)
//     await app.ready()   // wait for fastify to be ready


//     // #### To get Authorised data we need to create user first and then login and send token in the header
//     const email = "test2@test.com"
//     const password = "123456"
//     const createUserData = {
//         name: "test2",
//         email: email,
//         password: password
//     }
//     await supertest(app.server).post('/api/user/register').send(createUserData)
//     const loginData = {
//         email: email,
//         password: password
//     }
//     const loginResponse = await supertest(app.server).post('/api/user/login').send(loginData)
//     // set token for further requests
//     token = loginResponse.body.token
// })

// afterAll(async () => {
//     // close the mongoose connection
//     await mongoose.connection.close();
// })

// export { app, token };