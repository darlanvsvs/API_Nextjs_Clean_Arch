import { describe, it, expect } from "vitest";

// Iremos importar nosso schema que AINDA NÃO FOI CRIADO
import { UserSchema } from "./user.schema";

describe("User Domain Schema Validation (Enterprise Business Rules)", () => {
  it("should reject data with an invalid email format", () => {
    // 1. Dados inválidos
    const invalidData = {
      email: "usuario.invalido", // Não tem '@'
      password: "password123",
    };

    // 2. Esperamos que a função 'parse' do Zod LANCE um erro
    expect(() => UserSchema.parse(invalidData)).toThrow();
  });

  // Adicionamos um segundo teste para validar o caminho feliz
  it("should pass with valid data", () => {
    const validData = {
      email: "teste@dominio.com",
      password: "superseguranca123",
    };

    // 3. Esperamos que não lance nenhum erro
    expect(() => UserSchema.parse(validData)).not.toThrow();
  });
});
