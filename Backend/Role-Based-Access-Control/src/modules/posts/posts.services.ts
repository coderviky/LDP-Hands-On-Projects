// POSTS db access functions
import { InferInsertModel } from "drizzle-orm";
import { db } from "../../db/db";
import { postTable } from "../../db/schema";


// create a new post in db table "post"
export async function createPostInDB(
    data: InferInsertModel<typeof postTable>
) {
    // add data in post table
    const result = await db.insert(postTable).values(data).returning();

    // return the result
    return result[0];

}


// get all posts from the database
export async function getAllPostsFromDB() {

    const results = await db.select().from(postTable)

    return results;
}
