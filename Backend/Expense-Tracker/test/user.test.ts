// USER endpoint Testing using Supertest and Jest
import supertest from "supertest";
import { createFastifyApp } from "../src/server";
import mongoose from "mongoose";

const app = createFastifyApp();


// User endpoints testing
describe('User Endpoints', () => {
    // before all and after all hooks
    beforeAll(async () => {
        // connect mongoose to the test database by using the global process.env.MONGO_URI
        await mongoose.connect(process.env['MONGO_URI'] as string)
    })

    afterAll(async () => {
        // close the mongoose connection
        await mongoose.connection.close();
    })


    describe('POST /api/user/register', () => {
        it('should create a new user', async () => {
            // expect(1).toBe(1);
            const data = {
                name: "test",
                email: "test@test.com",
                password: "123456"
            }
            await app.ready();
            const response = await supertest(app.server).post('/api/user/register').send(data)
            // console.log(response.body);
            expect(response.status).toBe(201);
        });
    });
});
