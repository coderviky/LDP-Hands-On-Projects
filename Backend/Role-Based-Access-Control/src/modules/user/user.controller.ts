// User Routes Logic Part
import { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserBody } from "./user.schema";
import { assignRoleToUser, createUserInDB, getUsersByApplication } from "./user.services";
import { SYSTEM_ROLES } from "../../config/permissions";
import { get } from "http";
import { getRoleByAppAndRoleName } from "../role/role.services";


// create user route handler function
export async function createUserHandler(
    request: FastifyRequest<{
        Body: CreateUserBody
    }>,
    reply: FastifyReply
) {
    // get the data and intialuser from the request
    const { initialuser, ...data } = request.body;

    // set role based on initialuser
    const roleName = initialuser ? SYSTEM_ROLES.SUPER_ADMIN : SYSTEM_ROLES.APPLICATION_USER;

    // if role is SYSTEM_ROLES.SUPER_ADMIN find roles for application in the database to chceck is there any super admin role
    if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
        const appUsers = await getUsersByApplication(data.applicationId);
        if (appUsers.length > 0) {
            return reply.code(400).send({
                message: "Super admin already exists for this application"
            });
        }
    }

    // there is no super admin for this application
    // so check role in roles table for this application
    const role = await getRoleByAppAndRoleName(data.applicationId, roleName);

    // if role does not exist in the database
    if (!role) {
        return reply.code(400).send({
            message: "Role does not exist"
        });
    }

    // role exist so try to create user or catch error
    try {
        // create user in the database with hashed password
        const user = await createUserInDB(data);

        // add user with role and application in user_role table
        await assignRoleToUser({
            applicationId: data.applicationId,
            roleId: role.id,
            userId: user.id
        });

        reply.code(201).send(user);

    } catch (error) {
        return reply.code(500).send({
            message: "Error creating user"
        });
    }





}