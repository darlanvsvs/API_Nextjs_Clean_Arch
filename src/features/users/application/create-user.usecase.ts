import { UserRepository } from "./user.repository.interface";
// Também precisamos do UserSchema do DOMÍNIO para validar/filtrar dados
import { UserSchema } from "@/features/users/domain/user.schema";
// E precisamos de um adaptador (que ainda não existe) para o hash

export class CreateUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(input: { email: string; password: string }) {
    // 1. VALIDAR A ENTRADA CONTRA AS REGRAS DE DOMÍNIO
    // (O Use Case chama o Domínio para verificar se o input é válido)
    const validData = UserSchema.parse(input);

    // 2. ORQUESTRAÇÃO: Verificar se o usuário já existe
    const existingUser = await this.userRepository.findByEmail(validData.email);

    if (existingUser) {
      // 3. REGRA DE NEGÓCIO: Se achou, LANÇA UM ERRO (GREEN!)
      throw new Error("Email already exists");
    }

    // 4. PREPARAR DADOS (Aqui entraria o hash de senha)
    // Por enquanto, fingimos que o hash foi feito para o teste passar na lógica
    const dataToSave = {
      id: "fake-uuid",
      email: validData.email,
      password: validData.password, // Será o hash futuramente
    };

    // 5. Chamar o Repositório
    const newUser = await this.userRepository.save(dataToSave);

    return newUser;
  }
}
