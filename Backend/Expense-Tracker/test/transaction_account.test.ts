// TRANSACTION & ACCOUNT combined test
import supertest from 'supertest';
import { CreateTransactionBody } from '../src/modules/transaction/transaction.schema';
import mongoose from 'mongoose';
import { createFastifyApp } from '../src/server';

const app = createFastifyApp();

const INCOME = 'income';
const EXPENSE = 'expense';

describe('TRANSACTION & ACCOUNT Endpoints', () => {
    let token = '';

    // before all and after all hooks
    beforeAll(async () => {
        // connect mongoose by using the global process.env.MONGO_URI
        await mongoose.connect(process.env['MONGO_URI'] as string);
        await app.ready(); // wait for fastify to be ready

        //To get Authorised data we need to create user first and then login and send token in the header
        const name = 'transaction_test';
        const email = name + '@test.com';
        const password = '123456';
        await supertest(app.server)
            .post('/api/user/register')
            .send({ name, email, password });

        const loginResponse = await supertest(app.server)
            .post('/api/user/login')
            .send({ email, password });

        token = loginResponse.body.token;
    });

    afterAll(async () => {
        // close the mongoose connection
        await mongoose.connection.close();
    });

    const currentDate = new Date();
    const CREATE_TRANSACTION_API = '/api/transaction/';
    //-------------------------
    // ## 1. CREATE INITIAL TRANSACTIONS
    describe('CREATE INITIAL TRANSACTIONS : Current Month', () => {
        // 1.1 create income transaction
        describe('POST ' + CREATE_TRANSACTION_API, () => {
            const date = currentDate.toISOString()

            it('should create a new Income transaction', async () => {
                const incomeTransactionData: CreateTransactionBody = {
                    date,
                    amount: 5000,
                    type: INCOME,
                    category: 'salary'
                };
                const response = await supertest(app.server)
                    .post(CREATE_TRANSACTION_API)
                    .set('Authorization', `Bearer ${token}`)
                    .send(incomeTransactionData);
                // console.log(response.body);

                expect(response.status).toBe(201);

                // Validate the response body by checking the properties of the response
                expect(response.body).toHaveProperty('userId');
                expect(mongoose.Types.ObjectId.isValid(response.body.userId)).toBe(true);

                expect(response.body).toMatchObject({
                    date,
                    amount: 5000,
                    type: INCOME,
                    category: 'salary',
                    id: expect.any(String)
                });
            });

            it('should create a new Expense transaction', async () => {
                const expenseTransactionData: CreateTransactionBody = {
                    date,
                    amount: 250,
                    type: EXPENSE,
                    category: 'Food'
                };
                const response = await supertest(app.server)
                    .post(CREATE_TRANSACTION_API)
                    .set('Authorization', `Bearer ${token}`)
                    .send(expenseTransactionData);
                // console.log(response.body);

                expect(response.status).toBe(201);

                // Validate the response body by checking the properties of the response
                expect(response.body).toHaveProperty('userId');
                expect(mongoose.Types.ObjectId.isValid(response.body.userId)).toBe(true);

                expect(response.body).toMatchObject({
                    date,
                    amount: expenseTransactionData.amount * -1,
                    type: EXPENSE,
                    category: expenseTransactionData.category,
                });

                // one more expense transaction with different category
                const expenseTransactionData2: CreateTransactionBody = {
                    date,
                    amount: 100,
                    type: EXPENSE,
                    category: 'Transport'
                };
                const response2 = await supertest(app.server)
                    .post(CREATE_TRANSACTION_API)
                    .set('Authorization', `Bearer ${token}`)
                    .send(expenseTransactionData2);

                expect(response2.status).toBe(201);
            });


        });
    })

    // -------------------------


    // -------------------------
    // ## 2. GET CURRENT MONTH DATA
    const GET_CURRENT_MONTH_DATA_API = '/api/account/current-month';
    describe('GET ' + GET_CURRENT_MONTH_DATA_API, () => {
        it('should return 200 and data', async () => {
            const response = await supertest(app.server)
                .get(GET_CURRENT_MONTH_DATA_API)
                .set('Authorization', `Bearer ${token}`)
                .send();

            // console.log(response.body);

            expect(response.status).toBe(200);

            // Validate the response body
            const expectedResponse = {
                currentYear: new Date().getFullYear(),
                currentMonth: new Date().getMonth(),
                balance: 5000 - 250 - 100,
                isData: true
            };

            // Check that response has userId and it is different each time
            expect(response.body).toHaveProperty('userId');
            expect(mongoose.Types.ObjectId.isValid(response.body.userId)).toBe(true);

            // Check other properties
            expect(response.body).toMatchObject(expectedResponse);
        });
    });

    // get prev month and year
    const previousDate = new Date();
    previousDate.setMonth(previousDate.getMonth() - 1); // for prev month date
    // -------------------------

    // -------------------------
    // ## 3. CREATE TRANSACTIONs : for prev month
    describe('CREATE TRANSACTIONS : Previous Month', () => {
        // 3.1 create income transaction
        describe('POST ' + CREATE_TRANSACTION_API, () => {
            const date = previousDate.toISOString(); // for prev month date

            it('should create a new Income transaction', async () => {
                const incomeTransactionData: CreateTransactionBody = {
                    date,
                    amount: 6000,
                    type: INCOME,
                    category: 'salary'
                };
                const response = await supertest(app.server)
                    .post(CREATE_TRANSACTION_API)
                    .set('Authorization', `Bearer ${token}`)
                    .send(incomeTransactionData);

                expect(response.status).toBe(201);

                // Validate the response body by checking the properties of the response
                expect(response.body).toHaveProperty('userId');
                expect(mongoose.Types.ObjectId.isValid(response.body.userId)).toBe(true);

                expect(response.body).toMatchObject({
                    date: incomeTransactionData.date,
                    amount: incomeTransactionData.amount,
                    type: INCOME,
                    category: incomeTransactionData.category,
                    id: expect.any(String)
                });
            });

            it('should create a new Expense transaction', async () => {
                const expenseTransactionData: CreateTransactionBody = {
                    date,
                    amount: 300,
                    type: EXPENSE,
                    category: 'Food'
                };
                const response = await supertest(app.server)
                    .post(CREATE_TRANSACTION_API)
                    .set('Authorization', `Bearer ${token}`)
                    .send(expenseTransactionData);
                // console.log(response.body);

                expect(response.status).toBe(201);

                // Validate the response body by checking the properties of the response
                expect(response.body).toHaveProperty('userId');
                expect(mongoose.Types.ObjectId.isValid(response.body.userId)).toBe(true);

                expect(response.body).toMatchObject({
                    date: expenseTransactionData.date,
                    amount: expenseTransactionData.amount * -1,
                    type: EXPENSE,
                    category: expenseTransactionData.category,
                });

                // one more expense transaction with different category
                const expenseTransactionData2: CreateTransactionBody = {
                    date,
                    amount: 150,
                    type: EXPENSE,
                    category: 'Transport'
                };
                const response2 = await supertest(app.server)
                    .post(CREATE_TRANSACTION_API)
                    .set('Authorization', `Bearer ${token}`)
                    .send(expenseTransactionData2);

                expect(response2.status).toBe(201);
            }
            );
        }
        );
    })
    // -------------------------

    // -------------------------
    // ## 4. GET PREVIOUS MONTH DATA
    const GET_PREVIOUS_MONTH_DATA_API = '/api/account/' + previousDate.getFullYear() + '/' + (previousDate.getMonth());  // here month is 0 based index 
    describe('GET ' + GET_PREVIOUS_MONTH_DATA_API, () => {
        it('should return 200 and data', async () => {
            const response = await supertest(app.server)
                .get(GET_PREVIOUS_MONTH_DATA_API)
                .set('Authorization', `Bearer ${token}`)
                .send();

            // console.log(response.body);

            expect(response.status).toBe(200);

            // Validate the response body
            const expectedResponse = {
                year: previousDate.getFullYear(),
                month: previousDate.getMonth(), // response month is 0 based index
                balance: 6000 - 300 - 150,
                isData: true
            };

            // Check that response has userId and it is different each time
            expect(response.body).toHaveProperty('userId');
            expect(mongoose.Types.ObjectId.isValid(response.body.userId)).toBe(true);

            // Check other properties
            expect(response.body).toMatchObject(expectedResponse);
        });
    });
    // -------------------------


    // -------------------------
    // ## 5. GET CATEGORY WISE DATA (Current Month) - /:year/:month/:type/category-wise/
    // get current month and year
    const GET_CATEGORY_WISE_DATA_CURRENT_MONTH_API = '/api/account/' + currentDate.getFullYear() + '/' + currentDate.getMonth() + '/';
    describe('GET ' + GET_CATEGORY_WISE_DATA_CURRENT_MONTH_API + 'type/category-wise/', () => {
        it('should return 200 and data : INCOME', async () => {
            const response = await supertest(app.server)
                .get(GET_CATEGORY_WISE_DATA_CURRENT_MONTH_API + INCOME + '/category-wise/')
                .set('Authorization', `Bearer ${token}`)
                .send();

            console.log("in categorywise data test => response.body : ", response.body);


            expect(response.status).toBe(200);

            // Validate the response body
            const expectedResponse = {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth(),
                type: INCOME,
                // categoryWise: expect.arrayContaining<Record<string, any>>(
                //     [
                //         {
                //             _id: 'salary',
                //             total: 5000
                //         },
                //     ]
                // )
            };

            // Check that response has userId and it is different each time
            expect(response.body).toHaveProperty('userId');
            expect(mongoose.Types.ObjectId.isValid(response.body.userId)).toBe(true);

            // Check other properties
            expect(response.body).toMatchObject(expectedResponse);
        });

        it('should return 200 and data : EXPENSE', async () => {
            const response = await supertest(app.server)
                .get(GET_CATEGORY_WISE_DATA_CURRENT_MONTH_API + EXPENSE + '/category-wise/')
                .set('Authorization', `Bearer ${token}`)
                .send();

            // console.log("in categorywise data test => response.body : ", response.body);

            expect(response.status).toBe(200);

            // Validate the response body
            const expectedResponse = {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth(),
                type: EXPENSE,
                categoryWiseData: expect.arrayContaining<Record<string, any>>(
                    [
                        {
                            _id: 'Food',
                            total: -250
                        },
                        {
                            _id: 'Transport',
                            total: -100
                        }
                    ]
                )
            };

            // Check that response has userId and it is different each time
            expect(response.body).toHaveProperty('userId');
            expect(mongoose.Types.ObjectId.isValid(response.body.userId)).toBe(true);

            // Check other properties
            expect(response.body).toMatchObject(expectedResponse);

        })

    })




});
