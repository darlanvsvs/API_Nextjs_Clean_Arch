// src/shared/lib/db.ts

import { PrismaClient } from "@prisma/client";
import path from "path"; // <--- NOVO: Importar biblioteca de caminhos

// O Caminho Real que o Next.js tem que usar
const DATABASE_URL = `file:${path.resolve(process.cwd(), "prisma", "dev.db")}`;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [{ level: "query", emit: "event" }],
    // 1. Dizer ao Prisma para usar o Caminho Absoluto que acabamos de construir
    datasourceUrl: DATABASE_URL, // <--- NOVO: Definir a URL do banco aqui
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
