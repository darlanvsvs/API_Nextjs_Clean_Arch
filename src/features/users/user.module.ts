// src/features/users/user.module.ts

import { CreateUserUseCase } from "./application/create-user.usecase";
import { LoginUserUseCase } from "./application/login-user.usecase";
import { PrismaUserRepository } from "./infrastructure/PrismaUserRepository";
import { BcryptHashingService } from "./infrastructure/BcryptHashingService";
import { JsonWebTokenService } from "./infrastructure/JsonWebTokenService";
import { GetAuthenticatedUserUseCase } from "./application/get-authenticated-user.usecase";

// 1. Criamos as instâncias da INFRAESTRUTURA (a borda)
const userRepository = new PrismaUserRepository();
const hashingService = new BcryptHashingService();
const jwtService = new JsonWebTokenService(); // <--- NOVA INSTÂNCIA

// 2. Montamos o Use Case de CRIAÇÃO
export const createUserController = new CreateUserUseCase(
  userRepository,
  hashingService
);

// 3. Montamos o Use Case de LOGIN (INJETANDO O NOVO SERVIÇO)
export const loginUserController = new LoginUserUseCase(
  userRepository,
  hashingService,
  jwtService // <--- NOVO ARGUMENTO INJETADO
);

// NOVO: 3. Montamos o Use Case de Autorização
export const getAuthenticatedUserController = new GetAuthenticatedUserUseCase(
  userRepository,
  jwtService // <--- Injetamos apenas o Repositório e o JWTService
);
