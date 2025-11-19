import { db } from "@/shared/lib/db"; // Importamos a conexão real com o banco
import {
  UserSaveData,
  UserRepository,
} from "@/features/users/application/user.repository.interface";

// Este é o Adaptador que implementa o contrato UserRepository
export class PrismaUserRepository implements UserRepository {
  // Implementação do método de busca por email
  async findByEmail(email: string): Promise<UserSaveData | null> {
    // Usamos o método findUnique do Prisma (específico do SQLite)
    return db.user.findUnique({
      where: { email },
      // O select é importante para não retornar o hash para fora da camada de infraestrutura,
      // mas para este teste vamos retornar tudo como o contrato espera:
    }) as Promise<UserSaveData | null>;
  }

  // Implementação do método de salvar
  async save(user: UserSaveData): Promise<UserSaveData> {
    // Usamos o método create do Prisma para salvar
    const createdUser = await db.user.create({
      data: user,
    });

    // O Prisma gera o ID automaticamente, satisfazendo nosso contrato.
    return createdUser as UserSaveData;
  }
}
