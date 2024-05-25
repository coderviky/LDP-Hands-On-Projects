
import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";



// user table using drizzle orm
export const usersTable = pgTable("users", {
    id: serial("userId").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date())
}) 