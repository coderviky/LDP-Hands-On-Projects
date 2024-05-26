// User Routes Logic Part
import { FastifyRequest, FastifyReply, RouteGenericInterface } from "fastify";
import { AssignRoleToUserBody, CreateUserBody, LoginUserBody } from "./user.schema";
import { assignRoleToUser, createUserInDB, findUserByEmailAndPassword, getUsersByApplication } from "./user.services";
import { SYSTEM_ROLES } from "../../config/permissions";
import { getRoleByAppAndRoleName } from "../role/roles.services";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";



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

        // send the user data in response
        reply.code(201).send(user);

    } catch (error) {
        return reply.code(500).send({
            message: "Error creating user"
        });
    }

}



// LOGIN user route handler function
export async function loginUserHandler(
    request: FastifyRequest<{
        Body: LoginUserBody
    }>,
    reply: FastifyReply
) {
    // get email and password and applicationId from the request
    const { email, password, applicationId } = request.body;

    const user = await findUserByEmailAndPassword(email, password, applicationId);

    // if user does not exist
    if (!user) {
        return reply.code(404).send({
            message: "User does not exist"
        });
    }

    // verify password
    const isPasswordValid = await argon2.verify(user.password, password);

    // if password is not valid
    if (!isPasswordValid) {
        return reply.code(400).send({
            message: "Invalid password"
        });
    }

    // send the user data in response
    // reply.code(200).send(user);

    // send jwt token in response
    // this jwt token will be used to authenticate user in further requests
    // by decoding the token in the request header by middleware/hook for "onRequest" event
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        applicationId: user.applicationId,
        scopes: user.permissions
    }, env.JWT_SECRET as string);

    reply.code(200).send({
        token
    });

}


interface AssignRoleToUserRouteInterface extends RouteGenericInterface {
    Body: AssignRoleToUserBody;
}

// assign role to user handler
export async function assignRoleToUserHandler(
    request: FastifyRequest<AssignRoleToUserRouteInterface>,
    reply: FastifyReply
) {
    // get user from request & applicationId from user
    const user = request.user;
    const applicationId = user.applicationId;

    // get data from the request
    const data = request.body;

    // add user with role and application in user_role table
    await assignRoleToUser({
        applicationId,
        roleId: data.roleId,
        userId: data.userId
    });

    // send the response
    reply.code(201).send({
        message: `Role ${data.roleId} assigned to user ${data.userId} successfully`
    });

}