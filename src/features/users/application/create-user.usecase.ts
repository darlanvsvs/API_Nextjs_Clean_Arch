// src/features/users/application/create-user.usecase.ts

import { UserRepository } from "./user.repository.interface";
import { HashingService } from "./hashing.service.interface";
// OBS: Você ainda não tem o import do UserSchema aqui

export class CreateUserUseCase {
  private userRepository: UserRepository;
  private hashingService: HashingService;

  // O construtor aceita DUAS dependências
  constructor(userRepository: UserRepository, hashingService: HashingService) {
    this.userRepository = userRepository;
    this.hashingService = hashingService;
  }

  async execute(input: { email: string; password: string }) {
    // 1. ORQUESTRAÇÃO: Verificar se o usuário já existe
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      // REGRA DE NEGÓCIO: Lança erro se duplicado
      throw new Error("Email already exists");
    }

    // 2. APLICAÇÃO DA SEGURANÇA: Usa o serviço injetado para criar o hash
    const hashedPassword = await this.hashingService.hash(input.password);

    // 3. PREPARAR DADOS
    const dataToSave = {
      id: "fake-uuid",
      email: input.email,
      password: hashedPassword,
    };

    // 4. Chamar o Repositório
    const newUser = await this.userRepository.save(dataToSave);

    return newUser;
  }
} // <--- A chave final da classe deve ser esta!
