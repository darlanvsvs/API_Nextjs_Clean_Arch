import { z } from "zod";

// Aqui definimos a regra de negócio para a criação de um usuário.
// Esta é a nossa ENTERPRISE BUSINESS RULE (Regra de Negócio Empresarial).
// Ela não tem dependência de banco de dados ou API. É lógica pura.
export const UserSchema = z.object({
  email: z
    .string()
    .email("O email deve ter um formato válido (ex: user@domain.com)"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

// Definimos o Tipo TypeScript para garantir que todo o sistema use o mesmo contrato
export type User = z.infer<typeof UserSchema>;
