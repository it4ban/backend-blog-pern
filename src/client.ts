import { PrismaClient } from '@prisma/client';

interface CustomeNodejsGlobal extends Global {
	prisma: PrismaClient;
}

declare const global: CustomeNodejsGlobal;

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

module.exports = prisma;
