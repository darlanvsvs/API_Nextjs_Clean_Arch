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

    // 2. Regra de Negócio: Se o usuário não for achado, lançar erro (Já implementado)
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // 3. APLICAÇÃO DA SEGURANÇA: Comparar a senha (usando o HashingService injetado)
    // O HashingService (Bcrypt) recebe a senha crua e o hash do banco.
    const passwordMatch = await this.hashingService.compare(
      input.password,
      user.password
    );

    // 4. Regra de Negócio: Se a senha NÃO bater, lançar o erro
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    // 5. Sucesso: Devolve o usuário
    return user;
  }
}
