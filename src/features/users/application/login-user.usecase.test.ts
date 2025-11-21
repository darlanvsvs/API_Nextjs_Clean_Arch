import { describe, it, expect, vi, Mock } from "vitest";
import {
  UserRepository,
  UserSaveData,
} from "@/features/users/application/user.repository.interface";
import { HashingService } from "@/features/users/application/hashing.service.interface";
import { LoginUserUseCase } from "./login-user.usecase";
import {
  JWTService,
  TokenPayload,
} from "@/features/users/application/jwt.service.interface";

// --- Configuração e Mocks (Reutilizados) ---

// --- MockUserRepository ---
class MockUserRepository implements UserRepository {
  // Tipagem simplificada: (input) => Promise<output>
  save: (user: UserSaveData) => Promise<UserSaveData> = vi.fn();
  findByEmail: (email: string) => Promise<UserSaveData | null> = vi.fn();
}

// --- MockHashingService ---
class MockHashingService implements HashingService {
  // Tipagem simplificada:
  hash: (password: string) => Promise<string> = vi
    .fn()
    .mockResolvedValue("hashed_secret_from_mock");
  compare: (password: string, hash: string) => Promise<boolean> = vi.fn();
}

// --- MockJWTService (O Novo) ---
class MockJWTService implements JWTService {
  // Tipagem simplificada:
  generateToken: (payload: TokenPayload) => string = vi.fn(); // Retorno Síncrono (string)
  verifyToken: (token: string) => TokenPayload | null = vi.fn();
}

describe("LoginUserUseCase (Application Layer)", () => {
  let mockRepo: MockUserRepository;
  let mockHashingService: MockHashingService;
  let useCase: LoginUserUseCase;
  let mockJWTService: MockJWTService;

  const foundUser: UserSaveData = {
    id: "user-uuid-456",
    email: "found@user.com",
    password: "hashed_password",
  };

  beforeEach(() => {
    mockRepo = new MockUserRepository();
    mockHashingService = new MockHashingService();
    mockJWTService = new MockJWTService();
    // O Use Case de Login precisa das duas dependências
    // Isso causará um erro de compilação/importação (RED)
    useCase = new LoginUserUseCase(
      mockRepo,
      mockHashingService,
      mockJWTService
    );
    vi.clearAllMocks();
  });

  // 🔴 TESTE 1: Deve falhar se o usuário não for encontrado
  it('should throw "Invalid credentials" if user is not found (RED)', async () => {
    const inputData = { email: "nonexistent@user.com", password: "password" };

    // 1. Arrange: Treinamos o repositório para RETORNAR NULL (Usuário não existe)
    (mockRepo.findByEmail as Mock).mockResolvedValue(null);

    // 2. Assert (A Falha Esperada): Esperamos que ele lance um erro
    await expect(useCase.execute(inputData)).rejects.toThrow(
      "Invalid credentials"
    );

    // 3. Assert Secundário: Garantimos que o findByEmail foi chamado
    expect(mockRepo.findByEmail).toHaveBeenCalledWith(inputData.email);
  });

  // 🔴 TESTE 2: Deve falhar se a senha estiver incorreta
  it('should throw "Invalid credentials" if password comparison fails (RED)', async () => {
    const inputData = { email: "found@user.com", password: "wrong_password" };

    // 1. Arrange: O repositório ENCONTRA o usuário
    const foundUser: UserSaveData = {
      id: "uuid-1",
      email: inputData.email,
      password: "hashed_password",
    };
    (mockRepo.findByEmail as Mock).mockResolvedValue(foundUser);

    // 2. Arrange: O serviço de HASH retorna FALSO (senha incorreta)
    (mockHashingService.compare as Mock).mockResolvedValue(false);

    // 3. Assert (A Falha Esperada): Deve lançar o mesmo erro de credenciais inválidas.
    await expect(useCase.execute(inputData)).rejects.toThrow(
      "Invalid credentials"
    );

    // 4. Assert Secundário: Garantimos que o 'compare' foi chamado com a senha crua.
    expect(mockHashingService.compare).toHaveBeenCalledWith(
      inputData.password,
      foundUser.password
    );
  });

  // 🔴 TESTE 3: Deve gerar e retornar o token na chamada bem-sucedida (RED)
  it("should generate and return a token on successful login (RED)", async () => {
    // ARRANGE
    const expectedToken = "JWT_TOKEN_GENERATED_BY_MOCK";
    const inputData = { email: foundUser.email, password: "correct_password" };

    // 1. Configura mocks para SUCESSO
    (mockRepo.findByEmail as Mock).mockResolvedValue(foundUser);
    (mockHashingService.compare as Mock).mockResolvedValue(true); // Senha correta
    // 2. Configura o mock de JWT para retornar o token esperado
    (mockJWTService.generateToken as Mock).mockReturnValue(expectedToken);

    // 3. ACT
    const result = await useCase.execute(inputData);

    // 4. ASSERT (A falha lógica: o Use Case ainda retorna o objeto User, não o token)
    expect(mockJWTService.generateToken).toHaveBeenCalledTimes(1);
    expect(mockJWTService.generateToken).toHaveBeenCalledWith({
      userId: foundUser.id,
      email: foundUser.email,
    });

    // O teste falhará porque o Use Case retorna o objeto User, mas esperamos o Token.
    expect(result).toBe(expectedToken);
    expect(result).not.toHaveProperty("password"); // Garante que não devolve a senha
  });
});
