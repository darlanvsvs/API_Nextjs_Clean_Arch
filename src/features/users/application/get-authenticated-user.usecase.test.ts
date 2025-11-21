import { describe, it, expect, vi, Mock, beforeEach } from "vitest";

// Contratos necessários (existentes)
import {
  UserRepository,
  UserSaveData,
} from "@/features/users/application/user.repository.interface";
import {
  JWTService,
  TokenPayload,
} from "@/features/users/application/jwt.service.interface";

// Importa o Use Case que AINDA NÃO EXISTE
import { GetAuthenticatedUserUseCase } from "./get-authenticated-user.usecase";

// --- Configuração e Mocks (Reutilizados) ---

class MockUserRepository implements UserRepository {
  // REMOVEMOS TODAS AS ANOTAÇÕES DE TIPO DE FUNÇÃO AQUI.
  // O TypeScript garante a conformidade através do 'implements UserRepository'
  save = vi.fn();
  findByEmail = vi.fn();
  findById = vi.fn();
}

class MockJWTService implements JWTService {
  // REMOVEMOS TODAS AS ANOTAÇÕES DE TIPO DE FUNÇÃO AQUI.
  generateToken = vi.fn();
  verifyToken = vi.fn();
}

describe("GetAuthenticatedUserUseCase (Application Layer)", () => {
  let mockRepo: MockUserRepository;
  let mockJWTService: MockJWTService;
  let useCase: GetAuthenticatedUserUseCase;

  beforeEach(() => {
    mockRepo = new MockUserRepository();
    mockJWTService = new MockJWTService();
    // O Use Case precisa das duas dependências
    // Isso causará um erro de compilação/importação (RED)
    useCase = new GetAuthenticatedUserUseCase(mockRepo, mockJWTService);
    vi.clearAllMocks();
  });

  // 🔴 TESTE 1: Deve falhar se o token não for fornecido (RED)
  it('should throw "Authentication required" if token is missing', async () => {
    const token = null; // O token não foi enviado

    // 1. Arrange: Garantimos que o verifyToken não é chamado
    expect(mockJWTService.verifyToken).not.toHaveBeenCalled();

    // 2. Assert (A Falha Esperada): Esperamos que lance um erro
    await expect(useCase.execute(token)).rejects.toThrow(
      "Authentication required"
    );

    // 3. Assert Secundário: Nenhuma lógica de token ou banco de dados deve ser executada
    expect(mockRepo.findById).not.toHaveBeenCalled();
  });

  // 🔴 TESTE 2: Deve falhar se o token for inválido/expirado
  it('should throw "Authentication required" if token verification fails', async () => {
    const token = "invalid.token.string";

    // 1. Arrange: Treinamos o JWTService para retornar NULO (falha na verificação)
    (mockJWTService.verifyToken as Mock).mockReturnValue(null);

    // 2. Assert: Esperamos que o Use Case lance um erro
    await expect(useCase.execute(token)).rejects.toThrow(
      "Authentication required"
    );

    // 3. Assert Secundário: Garantimos que o Repositório NUNCA foi chamado
    expect(mockRepo.findById).not.toHaveBeenCalled();
  });

  // 🔴 TESTE 3: Deve falhar se o usuário do token não for encontrado (usuário deletado)
  it('should throw "Authentication required" if user is not found in repository', async () => {
    const token = "valid.token.pointing.to.deleted.user";
    const payload: TokenPayload = {
      userId: "deleted-user-id",
      email: "a@b.com",
    };

    // 1. Arrange: JWTService retorna um payload VÁLIDO
    (mockJWTService.verifyToken as Mock).mockReturnValue(payload);

    // 2. Arrange: Repositório retorna NULO (usuário não encontrado/deletado)
    (mockRepo.findById as Mock).mockResolvedValue(null);

    // 3. Assert: Esperamos que o Use Case lance o mesmo erro de autenticação
    await expect(useCase.execute(token)).rejects.toThrow(
      "Authentication required"
    );

    // 4. Assert Secundário: Garantimos que o Repositório FOI chamado com o ID do token
    expect(mockRepo.findById).toHaveBeenCalledWith(payload.userId);
  });
});
