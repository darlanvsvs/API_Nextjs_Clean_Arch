import { UserRepository, UserCreateData } from "./user.repository.interface"; // NOVO
import { HashingService } from "./hashing.service.interface";
// 1. IMPORTAÇÃO CRUCIAL: Trazendo a Regra de Negócio Pura (Zod Schema)
import { UserSchema } from "@/features/users/domain/user.schema";
// import { User as UserEntity } from '@/features/users/domain/user.schema';

export class CreateUserUseCase {
  private userRepository: UserRepository;
  private hashingService: HashingService;

  // O construtor aceita DUAS dependências
  constructor(userRepository: UserRepository, hashingService: HashingService) {
    this.userRepository = userRepository;
    this.hashingService = hashingService;
  }

  async execute(input: { email: string; password: string }) {
    // 2. APLICAÇÃO DA REGRA DE DOMÍNIO: O Use Case chama o Zod.
    //    Se o input for inválido, o Zod lança um erro AUTOMATICAMENTE,
    //    satisfazendo o 'rejects.toThrow()' do nosso teste.
    const validData = UserSchema.parse(input);

    // 3. ORQUESTRAÇÃO: Verificar se o usuário já existe (findByEmail)
    const existingUser = await this.userRepository.findByEmail(validData.email);

    if (existingUser) {
      throw new Error("Email already exists");
    }

    // 4. APLICAÇÃO DA SEGURANÇA: Usa o serviço injetado para criar o hash
    const hashedPassword = await this.hashingService.hash(validData.password);

    // 5. PREPARAR DADOS
    const dataToSave: UserCreateData = {
      // <--- Usamos o tipo sem ID aqui
      email: validData.email,
      password: hashedPassword,
    };

    // 6. Chamar o Repositório
    const newUser = await this.userRepository.save(dataToSave);

    return newUser;
  }
}
