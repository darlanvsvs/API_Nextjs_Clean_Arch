import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { CreateUserUseCase } from "./create-user.usecase";

// Interfaces que o Use Case espera
import {
  UserRepository,
  UserSaveData,
} from "@/features/users/application/user.repository.interface";
import { HashingService } from "@/features/users/application/hashing.service.interface";

// === MOCKS (Simulações de Infraestrutura) ===

class MockUserRepository implements UserRepository {
  save: Mock<[UserSaveData], Promise<UserSaveData>> = vi.fn();
  findByEmail: Mock<[string], Promise<UserSaveData | null>> = vi.fn();
}

class MockHashingService implements HashingService {
  // Definimos o que a função hash deve retornar para o teste
  hash: Mock<[string], Promise<string>> = vi
    .fn()
    .mockResolvedValue("hashed_secret_from_mock");
  compare: Mock<[string, string], Promise<boolean>> = vi.fn();
}

describe("CreateUserUseCase (Application Layer)", () => {
  let mockRepo: MockUserRepository;
  let mockHashingService: MockHashingService; // Nova dependência
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    // Criamos instâncias dos mocks
    mockRepo = new MockUserRepository();
    mockHashingService = new MockHashingService();

    // 1. INJETAMOS as duas dependências
    // O teste vai falhar na compilação porque o Use Case não aceita 2 argumentos ainda!
    useCase = new CreateUserUseCase(mockRepo, mockHashingService);

    vi.clearAllMocks();
  });

  it("should hash the password before calling the repository to save", async () => {
    // ARRANGE
    const rawPassword = "password123";
    const inputData = { email: "secure@user.com", password: rawPassword };

    const savedUser: UserSaveData = {
      id: "fake-uuid",
      email: inputData.email,
      password: "hashed_secret_from_mock", // O que o mock de hash retorna
    };

    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.save.mockResolvedValue(savedUser);

    // ACT
    const result = await useCase.execute(inputData);

    // ASSERT (Onde o teste falhará logicamente)
    // 2. Esperamos que o Hashing Service seja chamado com a senha crua:
    expect(mockHashingService.hash).toHaveBeenCalledWith(rawPassword);

    // 3. Esperamos que o Repositório seja chamado com o hash (o resultado do mock):
    expect(mockRepo.save).toHaveBeenCalledWith({
      ...savedUser,
      password: "hashed_secret_from_mock",
    });

    // 4. O resultado final deve ser o usuário mockado
    expect(result.password).toBe("hashed_secret_from_mock");
  });
});
