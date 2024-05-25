// APPLICATION Route Logic Part

import { FastifyRequest, FastifyReply } from "fastify";
import { CreateApplicationBody } from "./application.schema";
import { createApplicationInDB, getAllApplicationsFromDB } from "./application.services";
import { ALL_PERMISSIONS, SYSTEM_ROLES, USER_ROLE_PERMISSIONS } from "../../config/permissions";
import { createRoleInDB } from "../role/role.services";


// create application route handler function
export async function createApplicationHandler(
    request: FastifyRequest<{
        Body: CreateApplicationBody
    }>,
    reply: FastifyReply
) {
    // get the body from the request
    const data = request.body;

    // create application in the database
    const application = await createApplicationInDB(data);

    // create super admin role for the application in role table in db
    const superAdminRolePromise = createRoleInDB({
        name: SYSTEM_ROLES.SUPER_ADMIN,
        applicationId: application.id,
        permissions: ALL_PERMISSIONS
    });


    // create application user role for the application in role table in db
    const applicationUserRolePromise = createRoleInDB({
        name: SYSTEM_ROLES.APPLICATION_USER,
        applicationId: application.id,
        permissions: USER_ROLE_PERMISSIONS
    });

    const [superAdminRole, applicationUserRole] = await Promise.allSettled([superAdminRolePromise, applicationUserRolePromise]);

    if (superAdminRole.status === "rejected") {
        throw new Error("Error creating super admin role in db");
    }

    if (applicationUserRole.status === "rejected") {
        throw new Error("Error creating application user role in db");
    }


    reply.code(201).send({
        application,
        superAdminRole: superAdminRole.value,
        applicationUserRole: applicationUserRole.value
    });

}



// get all applications route handler function
export async function getApplicationsHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    // get all applications from the database
    const applications = await getAllApplicationsFromDB();

    reply.code(200).send(applications);

}