export default defineEventHandler(async (event) => {
    const {id} = getQuery(event);

    try {
        const user = await prisma.user.findUnique({
            select: {
                userID: true,
                userUsername: true,
                userFullName: true,
                userEmail: true,
                userPhone: true,
                userStatus: true,
                userCreatedDate: true,
                userModifiedDate: true,
            },
            where: {
                userID: parseInt(id),
            },
        });

        if (user) {
        // Get all roles for user
        let roleOfUser = await prisma.userrole.findMany({
            select: {
                role: {
                    select: {
                        roleID: true,
                        roleName: true,
                    },
                },
            },
            where: {
                userRoleUserID: user.userID,
            },
        });

        user.roles = roleOfUser;
        
        return {
            statusCode: 200,
            message: "Users successfully fetched",
            data: user,
        };
        } else {
        return {
            statusCode: 404,
            message: "No user found",
        };
        }
    } catch (error) {
        return {
        statusCode: 500,
        message: error.message,
        };
    }
});
