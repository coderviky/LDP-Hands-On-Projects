// test home route
import supertest from "supertest";
import { createFastifyApp } from "../src/server";


const app = createFastifyApp();


describe('Home Route', () => {
    it('should return 200', async () => {
        await app.ready();
        const response = await supertest(app.server).get('/');
        console.log(response.body);
        expect(response.status).toBe(200);
        // expect(response.body).toBe("EXPENSE TRACKER API");
    });

    it('should return name in response and return 201', async () => {
        await app.ready()
        const resposne = await supertest(app.server).post('/').send({ name: 'test' });
        // console.log(resposne.body);
        expect(resposne.status).toBe(201);
        expect(resposne.body).toEqual({ name: 'test' });
    })

})