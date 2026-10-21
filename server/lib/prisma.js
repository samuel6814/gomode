const { PrismaClient } = require('@prisma/client');

const prismaBase = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

const getPrismaWithUser = (userId, role = 'CUSTOMER') => {
  return prismaBase.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          return prismaBase.$transaction(async (tx) => {
            // Set variables for Postgres RLS
            await tx.$executeRawUnsafe(`SELECT set_config('app.current_user_id', '${userId}', true)`);
            await tx.$executeRawUnsafe(`SELECT set_config('app.current_user_role', '${role}', true)`);
            return query(args);
          });
        },
      },
    },
  });
};

module.exports = prismaBase;
module.exports.getPrismaWithUser = getPrismaWithUser;
