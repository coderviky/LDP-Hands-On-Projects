// USER endpoint Testing using Supertest and Jest
import supertest from "supertest";
import { createFastifyApp } from "../src/server";
import mongoose from "mongoose";
import { LoginUserSchema } from "../src/modules/user/user.schema";

const app = createFastifyApp();


// User endpoints testing
describe('User Endpoints', () => {
    // before all and after all hooks
    beforeAll(async () => {
        // connect mongoose to the test database by using the global process.env.MONGO_URI
        await mongoose.connect(process.env['MONGO_URI'] as string)
        await app.ready()
    })

    afterAll(async () => {
        // close the mongoose connection
        await mongoose.connection.close();
    })

    // -------------------------
    // ### 1. REGISTER API testing
    const REGISTER_API = '/api/user/register';
    describe('POST ' + REGISTER_API, () => {
        // common data for testing register endpoint
        const data = {
            name: "test",
            email: "test@test.com",
            password: "123456"
        }

        it('should create a new user', async () => {
            const response = await supertest(app.server).post(REGISTER_API).send(data)
            // console.log(response.body);
            expect(response.status).toBe(201);
        });

        it('should return 400 if the email already exists', async () => {
            const response = await supertest(app.server).post(REGISTER_API).send(data)
            // console.log(response.body);
            expect(response.status).toBe(400);
        });
    });
    // -------------------------

    // -------------------------
    // ### 2. LOGIN API testing
    const LOGIN_API = '/api/user/login';
    describe('POST' + LOGIN_API, () => {

        it('should login the user and send token', async () => {
            const data: LoginUserSchema = {
                email: "test@test.com",
                password: "123456"
            }
            const response = await supertest(app.server).post(LOGIN_API).send(data)
            // console.log(response.body);
            // expect 
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('token')
        })

        it('should return 404 if the email is not found', async () => {
            const data: LoginUserSchema = {
                email: "abc@test.com",
                password: "123456"
            }
            const response = await supertest(app.server).post(LOGIN_API).send(data)

            expect(response.status).toBe(404)
        })

        it('should return 401 if the password is incorrect', async () => {
            const data: LoginUserSchema = {
                email: "test@test.com",
                password: "1234567"
            }
            const response = await supertest(app.server).post(LOGIN_API).send(data)

            // expect
            expect(response.status).toBe(401)
        })
    })




    // -------------------------
});
