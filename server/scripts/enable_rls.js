const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '../.env' });

const prisma = new PrismaClient();

async function main() {
  console.log('Enabling Row Level Security on specific tables...');
  const tables = ['Order', 'Cart', 'Wishlist'];

  for (const table of tables) {
    try {
      console.log(`Setting up RLS for ${table}...`);
      
      // 1. Enable RLS
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);

      // 2. Drop existing policy if it exists to avoid errors on re-run
      await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "rls_policy_${table.toLowerCase()}" ON "${table}";`);

      // 3. Create Policy for SELECT (Read)
      // Admins bypass RLS, otherwise it must match the current user ID
      await prisma.$executeRawUnsafe(`
        CREATE POLICY "rls_policy_${table.toLowerCase()}"
        ON "${table}"
        FOR ALL
        USING (
          current_setting('app.current_user_role', true) = 'ADMIN' OR
          current_setting('app.current_user_id', true) = "userId"
        );
      `);

      console.log(`✅ RLS successfully enabled for ${table}`);
    } catch (error) {
      console.error(`❌ Failed to enable RLS for ${table}:`, error.message);
    }
  }

  console.log('Finished setting up RLS.');
  await prisma.$disconnect();
}

main().catch(console.error);
