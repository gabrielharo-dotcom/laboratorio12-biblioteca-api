import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL?.replace(/[?&]sslmode=[^&]+/g, '').replace('/postgres&', '/postgres?'),
    ssl: { rejectUnauthorized: true, ca: readFileSync(path.join(process.cwd(), 'certs/supabase-ca.crt'), 'utf8') },
  }),
});
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
