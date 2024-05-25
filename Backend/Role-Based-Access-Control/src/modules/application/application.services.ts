// APPLICATION db access functions

import { InferInsertModel } from "drizzle-orm";
import { db } from "../../db/db";
import { applicationTable } from "../../db/schema";

// create a new application in db table "application"
export async function createApplicationInDB(
    data: InferInsertModel<typeof applicationTable>
) {
    // add data in application table
    const result = await db.insert(applicationTable).values(data).returning();

    // return the result
    return result[0];

}


// get all applications from the database
export async function getAllApplicationsFromDB() {

    const results = await db.select().from(applicationTable)

    return results;
}