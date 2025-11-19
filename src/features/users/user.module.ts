// src/features/users/user.module.ts

// 1. Importa o Caso de Uso (Application Layer)
import { CreateUserUseCase } from "./application/create-user.usecase";

// 2. Importa as implementações REAIS (Infrastructure Layer)
import { PrismaUserRepository } from "./infrastructure/PrismaUserRepository";
import { BcryptHashingService } from "./infrastructure/BcryptHashingService";

// --- Montagem ---

// 3. Criamos as instâncias dos Adaptadores (Borda)
const userRepository = new PrismaUserRepository();
const hashingService = new BcryptHashingService();

// 4. Criamos o Use Case, INJETANDO as dependências reais
export const createUserController = new CreateUserUseCase(
  userRepository,
  hashingService
);
