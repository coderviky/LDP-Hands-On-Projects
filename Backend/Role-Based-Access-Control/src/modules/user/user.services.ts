// USER db access functions
import { InferInsertModel } from "drizzle-orm";
import { db } from "../../db/db";
import { userTable } from "../../db/schema";

// create a new user in db table "user"
// type NewUser = typeof usersTable.$inferSelect;

export async function createUserInDB(
    data: InferInsertModel<typeof userTable>
) {
    // add data in user table
    const result = await db.insert(userTable).values(data).returning();

    // return the result
    return result[0];

}
