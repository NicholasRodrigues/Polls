import {Prisma, PrismaClient} from '@prisma/client'

export const prisma = new PrismaClient(
    {
      log: ['query', 'info', 'warn']
    }
);
export type Context = {
  prisma: PrismaClient;
};