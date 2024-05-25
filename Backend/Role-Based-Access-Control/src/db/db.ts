// db connection and setup with drizzle

import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { env } from '../config/env';


const client = new Client({
    connectionString: env.DATABASE_CONNECTION
})

client.connect()
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.error('Error connecting to database', err);
    })

export const db = drizzle(client)