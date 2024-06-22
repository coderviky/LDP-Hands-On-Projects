
import { pgTable, serial, varchar, timestamp, primaryKey, integer, uniqueIndex, text } from "drizzle-orm/pg-core";


// application table using drizzle orm
export const applicationTable = pgTable("application", {
    id: serial("applicationId").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date())
});


// user table using drizzle orm
export const userTable = pgTable("users", {
    id: serial("userId").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    password: varchar("password", { length: 256 }).notNull(),
    applicationId: integer("applicationId").references(() => applicationTable.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date())
}, (usersTable) => {
    return {
        // cpk: primaryKey({ columns: [usersTable.id, usersTable.email, usersTable.applicationId] }),
        // idIndex: uniqueIndex("users_id_index").on(usersTable.id)
        emailApplicationIdUnique: uniqueIndex("users_email_applicationId_unique").on(usersTable.email, usersTable.applicationId) // Unique index on email and applicationId
    }
});


// role table using drizzle orm
export const roleTable = pgTable("role", {
    id: serial("roleId").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    applicationId: integer("applicationId").references(() => applicationTable.id),
    // permissions column is an array of strings
    permissions: text("permissions").array().$type<Array<string>>(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date())
}, (roleTable) => {
    return {
        // cpk: primaryKey({ columns: [roleTable.id, roleTable.name, roleTable.applicationId] }),
        // idIndex: uniqueIndex("role_id_index").on(roleTable.id)
        nameApplicationIdUnique: uniqueIndex("role_name_applicationId_unique").on(roleTable.name, roleTable.applicationId) // Unique index on name and applicationId
    }
});


// user_role table using drizzle orm - many to many relationship between user and role by applicationId
export const userToRoleTable = pgTable("user_to_role", {
    applicationId: integer("applicationId").references(() => applicationTable.id).notNull(),
    userId: integer("userId").references(() => userTable.id).notNull(),
    roleId: integer("roleId").references(() => roleTable.id).notNull(),
}, (userToRoleTable) => {
    return {
        cpk: primaryKey({ columns: [userToRoleTable.applicationId, userToRoleTable.userId, userToRoleTable.roleId] })
    }
})


// post table using drizzle orm
export const postTable = pgTable("post", {
    id: serial("postId").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    content: text("content").notNull(),
    userId: integer("userId").references(() => userTable.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date())
},
    (postTable) => {
        return {
            titleUserIdUnique: uniqueIndex("post_title_userId_unique").on(postTable.title, postTable.userId) // Unique index on title and userId
        }
    }
);
