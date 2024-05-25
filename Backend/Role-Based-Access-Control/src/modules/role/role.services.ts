// ROLE db access functions

import { InferInsertModel, and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { roleTable } from "../../db/schema";


// create a new role in db table "role"
export async function createRoleInDB(
    data: InferInsertModel<typeof roleTable>
) {
    // add data in role table
    const result = await db.insert(roleTable).values(data).returning();

    // return the result
    return result[0];

}


// get role by name and applicationId
export async function getRoleByAppAndRoleName(applicationId: number, roleName: string) {
    // find role with applicationId and roleName
    const result = await db
        .select()
        .from(roleTable)
        .where(and(eq(roleTable.applicationId, applicationId), eq(roleTable.name, roleName)));

    return result[0];
}