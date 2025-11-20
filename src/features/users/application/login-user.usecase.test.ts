import { describe, it, expect, vi, Mock } from "vitest";

// Interfaces que o Use Case espera (existentes)
import {
  UserRepository,
  UserSaveData,
} from "@/features/users/application/user.repository.interface";
import { HashingService } from "@/features/users/application/hashing.service.interface";

// Importa o Use Case que AINDA NÃO EXISTE
import { LoginUserUseCase } from "./login-user.usecase";

// --- Configuração e Mocks (Reutilizados) ---

class MockUserRepository implements UserRepository {
  // Usaremos findByEmail
  save = vi.fn();
  findByEmail = vi.fn<[string], Promise<UserSaveData | null>>(); // Keep this line as is
}

class MockHashingService implements HashingService {
  // Usaremos compare
  hash = vi.fn();
  compare = vi.fn().mockResolvedValue(true);
}

describe("LoginUserUseCase (Application Layer)", () => {
  let mockRepo: MockUserRepository;
  let mockHashingService: MockHashingService;
  let useCase: LoginUserUseCase;

  beforeEach(() => {
    mockRepo = new MockUserRepository();
    mockHashingService = new MockHashingService();
    // O Use Case de Login precisa das duas dependências
    // Isso causará um erro de compilação/importação (RED)
    useCase = new LoginUserUseCase(mockRepo, mockHashingService);
    vi.clearAllMocks();
  });

  // 🔴 TESTE 1: Deve falhar se o usuário não for encontrado
  it('should throw "Invalid credentials" if user is not found (RED)', async () => {
    const inputData = { email: "nonexistent@user.com", password: "password" };

    // 1. Arrange: Treinamos o repositório para RETORNAR NULL (Usuário não existe)
    mockRepo.findByEmail.mockResolvedValue(null);

    // 2. Assert (A Falha Esperada): Esperamos que ele lance um erro
    await expect(useCase.execute(inputData)).rejects.toThrow(
      "Invalid credentials"
    );

    // 3. Assert Secundário: Garantimos que o findByEmail foi chamado
    expect(mockRepo.findByEmail).toHaveBeenCalledWith(inputData.email);
  });

  // 🔴 TESTE 2 (O próximo passo): Deve falhar se a senha não bater.
  // ...
});
