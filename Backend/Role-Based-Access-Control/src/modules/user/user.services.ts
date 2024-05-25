// USER db access functions
import { InferInsertModel, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { userTable, userToRoleTable } from "../../db/schema";
import argon2 from "argon2";

// create a new user in db table "user"
// type NewUser = typeof usersTable.$inferSelect;

export async function createUserInDB(
    data: InferInsertModel<typeof userTable>
) {
    // create hashed password
    const hashedPassword = await argon2.hash(data.password);

    // add data in user table
    const result = await db.insert(userTable).values({
        ...data,
        password: hashedPassword
    }).returning(
        {
            id: userTable.id,
            name: userTable.name,
            email: userTable.email,
            applicationId: userTable.applicationId,
        }
    );

    // return the result
    return result[0];

}



// find user with super admin role for application
export async function getUsersByApplication(applicationId: number) {
    // find all users with applicationId
    const result = await db
        .select()
        .from(userTable)
        .where(eq(userTable.applicationId, applicationId));
    return result;
}



// assign role to user in user_role table
export async function assignRoleToUser(data: InferInsertModel<typeof userToRoleTable>) {
    // add data in user_role table
    await db.insert(userToRoleTable).values(data);
}