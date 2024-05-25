// USER db access functions
import { InferInsertModel } from "drizzle-orm";
import { db } from "../../db/db";
import { usersTable } from "../../db/schema";

// create a new user in db table "user"
// type NewUser = typeof usersTable.$inferSelect;

export async function createUserInDB(
    data: InferInsertModel<typeof usersTable>
) {
    // add data in user table
    const result = await db.insert(usersTable).values(data).returning();

    // return the result
    return result[0];

}
