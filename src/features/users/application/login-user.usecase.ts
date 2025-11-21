// src/features/users/application/login-user.usecase.ts

import { UserRepository } from "./user.repository.interface";
import { HashingService } from "./hashing.service.interface";
import { JWTService } from "./jwt.service.interface"; // <--- NOVO IMPORT

export class LoginUserUseCase {
  private userRepository: UserRepository;
  private hashingService: HashingService;
  private jwtService: JWTService; // <-- NOVA PROPRIEDADE

  // O construtor AGORA aceita TRÊS dependências
  constructor(
    userRepository: UserRepository,
    hashingService: HashingService,
    jwtService: JWTService // <-- NOVO ARGUMENTO
  ) {
    this.userRepository = userRepository;
    this.hashingService = hashingService;
    this.jwtService = jwtService; // <-- Salva a nova dependência
  }

  // O método de execução
  async execute(input: { email: string; password: string }) {
    // 1. Buscar o usuário pelo email
    const user = await this.userRepository.findByEmail(input.email);

    // 2. Se o usuário não for achado, lançar erro
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // 3. Comparar a senha
    const passwordMatch = await this.hashingService.compare(
      input.password,
      user.password
    );

    // 4. Se a senha NÃO bater, lançar o erro
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    // 5. NOVO: Gerar o token (O teste está esperando que esta linha seja chamada!)
    const token = this.jwtService.generateToken({
      userId: user.id,
      email: user.email,
    });

    // 6. Sucesso: Devolve o TOKEN gerado, e não mais o objeto completo do usuário
    return token;
  }
}
