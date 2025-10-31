import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

// Exporting prisma clint for all the files
export default prisma;
