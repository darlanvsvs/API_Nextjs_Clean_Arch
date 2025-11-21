import {
  JWTService,
  TokenPayload,
} from "@/features/users/application/jwt.service.interface";
import jwt from "jsonwebtoken";

// Regra de Infraestrutura: Chave Secreta e Configuração de Expiração
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-development-only";
const TOKEN_EXPIRATION = "1d";

export class JsonWebTokenService implements JWTService {
  // Implementação do método de geração de token
  generateToken(payload: TokenPayload): string {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured in the environment.");
    }

    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
  }

  // Implementação do método de verificação de token (usado para autorização)
  verifyToken(token: string): TokenPayload | null {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
      return payload;
    } catch (error) {
      // Se a verificação falhar (token expirado, inválido), retorna nulo.
      return null;
    }
  }
}
