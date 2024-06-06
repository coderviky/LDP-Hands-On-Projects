// Account endpoints TESTING
import mongoose from 'mongoose';
import supertest from 'supertest';
// import { app, token } from './setup/user_token_and_mongo_connect.setup';
import { createFastifyApp } from '../src/server';

const app = createFastifyApp()

//

describe('Account Endpoints', () => {
    let token = '';
    // let supertestAppServer: any;

    // before all and after all hooks
    beforeAll(async () => {
        // connect mongoose to the test database by using the global process.env.MONGO_URI
        await mongoose.connect(process.env['MONGO_URI'] as string)
        await app.ready()   // wait for fastify to be ready


        // #### To get Authorised data we need to create user first and then login and send token in the header
        const name = "account_test"
        const email = name + "@test.com"
        const password = "123456"
        const createUserData = {
            name: name,
            email: email,
            password: password
        }
        await supertest(app.server).post('/api/user/register').send(createUserData)
        const loginData = {
            email: email,
            password: password
        }
        const loginResponse = await supertest(app.server).post('/api/user/login').send(loginData)
        // set token for further requests
        token = loginResponse.body.token
    })

    afterAll(async () => {
        // close the mongoose connection
        await mongoose.connection.close();
    })


    //-------------------------
    // ### 1. CREATE ACCOUNT API testing
    const GET_CURRENT_MONTH_DATA_API = '/api/account/current-month';
    describe('POST ' + GET_CURRENT_MONTH_DATA_API, () => {

        it('should return 200 and empty data', async () => {
            console.log("in account post test => token : ", token)
            const response = await supertest(app.server).get(GET_CURRENT_MONTH_DATA_API).set('Authorization', `Bearer ${token}`).send()

            console.log("in account post test => response.body : ", response.body);

            expect(response.status).toBe(200);

            // Validate the response body
            const expectedResponse = {
                currentYear: new Date().getFullYear(),
                currentMonth: new Date().getMonth(), // month is 0 based
                balance: null,
                isData: false
            };

            // Check that response has userId and it is different each time
            expect(response.body).toHaveProperty('userId');
            expect(mongoose.Types.ObjectId.isValid(response.body.userId)).toBe(true);

            // Check other properties
            expect(response.body).toMatchObject(expectedResponse);
        })
    })

    // -------------------------




})