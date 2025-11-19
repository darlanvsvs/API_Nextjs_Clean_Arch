import { describe, it, expect, vi, Mock } from "vitest";

// Antigo (pode falhar):
// import { UserRepository, UserSaveData } from '../application/user.repository.interface';

// Novo (robusto):
import {
  UserRepository,
  UserSaveData,
} from "@/features/users/application/user.repository.interface";
// Antigo (falhando):
// import { CreateUserUseCase } from "./create-user.usecase";

// Novo (robusto, usando o alias @/):
import { CreateUserUseCase } from "@/features/users/application/create-user.usecase";

// 1. Criamos um MOCK (Simulação) que implementa o contrato (UserRepository)
class MockUserRepository implements UserRepository {
  // Estas são funções que o Use Case irá chamar
  save: Mock<[UserSaveData], Promise<UserSaveData>> = vi.fn();
  findByEmail: Mock<[string], Promise<UserSaveData | null>> = vi.fn();
}

describe("CreateUserUseCase (Application Layer)", () => {
  let mockRepo: MockUserRepository;
  let useCase: CreateUserUseCase;

  // Antes de cada teste, configuramos o ambiente
  beforeEach(() => {
    // Criamos uma instância do nosso repositório falso
    mockRepo = new MockUserRepository();

    // 2. Instanciamos o Use Case, INJETANDO o repositório falso.
    //    O Use Case não sabe que ele é falso, só sabe que segue o contrato.
    useCase = new CreateUserUseCase(mockRepo);

    // Garante que os espiões (spies) do mock estão limpos
    vi.clearAllMocks();
  });

  it("should call the repository to save the new user (RED)", async () => {
    // 3. Arrange: Definimos o que o repositório falso deve retornar se for chamado.
    const inputData = { email: "new@user.com", password: "password123" };
    const savedUser: UserSaveData = { id: "uuid-fake", ...inputData };

    // O repositório mockado deve fingir que o usuário não existe:
    mockRepo.findByEmail.mockResolvedValue(null);

    // E fingir que salvou o usuário, retornando o objeto salvo:
    mockRepo.save.mockResolvedValue(savedUser);

    // 4. Act: Rodamos o Use Case
    const result = await useCase.execute(inputData);

    // 5. Assert (O que deve FALHAR agora):
    // O teste vai falhar porque o Use Case não existe, mas a lógica exige que:
    expect(mockRepo.findByEmail).toHaveBeenCalledWith(inputData.email);
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(savedUser.id);
  });

  // NOVO CÓDIGO a ser adicionado em create-user.usecase.test.ts

  it("should throw an error if the email already exists (RED)", async () => {
    // 1. Arrange: Usamos os mesmos dados de entrada
    const inputData = { email: "existing@user.com", password: "password123" };

    // 2. Arrange: Treinamos o repositório para RETORNAR um usuário existente
    const existingUser: UserSaveData = { id: "uuid-existing", ...inputData };
    mockRepo.findByEmail.mockResolvedValue(existingUser);

    // 3. Assert (O teste que vai FALHAR)
    // Esperamos que a execução do Use Case Lance um Erro.
    await expect(useCase.execute(inputData)).rejects.toThrow(
      "Email already exists"
    );

    // 4. Assert Secundário: Garantimos que o 'save' NUNCA foi chamado
    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});
