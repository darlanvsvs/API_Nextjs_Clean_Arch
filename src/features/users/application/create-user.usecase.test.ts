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
  // Usamos o vi.fn() e deixamos o TS inferir que é uma função, mas mais importante,
  // garantimos que o objeto criado tenha as funções de mock.
  save = vi.fn();
  findByEmail = vi.fn();
}

class MockHashingService implements HashingService {
  // Removemos a tipagem complexa e deixamos o vi.fn() criar a função de mock
  hash = vi.fn().mockResolvedValue("hashed_secret_from_mock");
  compare = vi.fn();
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

    (mockRepo.findByEmail as Mock).mockResolvedValue(null);

    (mockRepo.save as Mock).mockResolvedValue(savedUser);

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

  it("should throw an error when data violates the Domain Schema (RED)", async () => {
    // 1. Arrange: Dados que violam as regras do DOMÍNIO (senha muito curta, email inválido)
    const invalidData = { email: "not-an-email", password: "123" };

    // 2. Assert (O teste que vai FALHAR)
    // Esperamos que o Use Case lance um erro porque o Zod vai falhar
    // (Lembre-se, o Use Case ainda não chama o Zod, por isso falhará)
    await expect(useCase.execute(invalidData)).rejects.toThrow();

    // 3. Assert Secundário: Garantimos que o Repositório NUNCA foi chamado
    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});
