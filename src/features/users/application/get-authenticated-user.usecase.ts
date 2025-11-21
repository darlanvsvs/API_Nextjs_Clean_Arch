// src/features/users/application/get-authenticated-user.usecase.ts

import { UserRepository } from "./user.repository.interface";
import { JWTService } from "./jwt.service.interface";
import { UserSaveData } from "./user.repository.interface";

// Este Use Case é chamado para verificar um token e retornar o usuário
export class GetAuthenticatedUserUseCase {
  private userRepository: UserRepository;
  private jwtService: JWTService;

  // O construtor injeta o Repositório e o Serviço de JWT
  constructor(userRepository: UserRepository, jwtService: JWTService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  // O método de execução recebe o token (que vem do header da requisição)
  async execute(token: string | null): Promise<UserSaveData> {
    // 1. REGRA DE SEGURANÇA: Token Ausente
    if (!token) {
      throw new Error("Authentication required");
    }

    // 2. ORQUESTRAÇÃO: Verificar validade do Token (via JWTService injetado)
    const payload = this.jwtService.verifyToken(token);

    if (!payload) {
      // REGRA DE NEGÓCIO: Token inválido/expirado
      throw new Error("Authentication required");
    }

    // 3. ORQUESTRAÇÃO: Buscar o usuário pelo ID contido no Token Payload
    // Usamos o findById, que o repositório deve fornecer (veremos a implementação depois)
    const user = await this.userRepository.findById(payload.userId);

    if (!user) {
      // REGRA DE NEGÓCIO: Token válido, mas usuário deletado (segurança)
      throw new Error("Authentication required");
    }

    // 4. SUCESSO: Retorna o objeto do usuário autenticado
    return user;
  }
}
