// src/features/users/application/login-user.usecase.ts

import { UserRepository } from "./user.repository.interface";
import { HashingService } from "./hashing.service.interface";

export class LoginUserUseCase {
  private userRepository: UserRepository;
  private hashingService: HashingService;

  // O construtor recebe as duas dependências (Injeção de Dependência)
  constructor(userRepository: UserRepository, hashingService: HashingService) {
    this.userRepository = userRepository;
    this.hashingService = hashingService;
  }

  // O método de execução
  async execute(input: { email: string; password: string }) {
    // 1. Orquestração: Buscar o usuário pelo email
    const user = await this.userRepository.findByEmail(input.email);

    // 2. Regra de Negócio: Se o usuário não for achado, lançar o erro esperado pelo teste
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Por enquanto, apenas devolvemos o objeto para fazer o teste passar no fluxo.
    return user;
  }
}
