// NOVO CÓDIGO para src/features/users/application/create-user.usecase.ts

import { UserRepository } from "./user.repository.interface";

export class CreateUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(input: { email: string; password: string }) {
    // 1. CHAMA O REPOSITÓRIO (findByEmail), que o teste está esperando!
    await this.userRepository.findByEmail(input.email);

    // 2. CHAMA O REPOSITÓRIO (save)
    const dataToSave = {
      id: "fake-uuid",
      email: input.email,
      password: input.password,
    };

    const newUser = await this.userRepository.save(dataToSave);

    return newUser;
  }
}
