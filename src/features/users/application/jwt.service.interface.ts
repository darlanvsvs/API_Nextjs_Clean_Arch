// src/features/users/application/jwt.service.interface.ts

// Define a estrutura de dados que será incluída no token (o payload)
export type TokenPayload = {
  userId: string;
  email: string;
};

// Interface que define o CONTRATO para qualquer serviço de Tokens
export interface JWTService {
  // Método para criar o token (deve ser síncrono, já que o I/O é interno)
  generateToken(payload: TokenPayload): string;

  // Método para validar e decodificar o token
  verifyToken(token: string): TokenPayload | null;
}
