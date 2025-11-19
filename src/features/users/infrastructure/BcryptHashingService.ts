import { HashingService } from "@/features/users/application/hashing.service.interface";
import { hash, compare } from "bcrypt";

// O custo de hash é uma regra de infraestrutura/segurança
const HASH_SALT_ROUNDS = 10;

// Esta classe é um ADAPTER (Adaptador) que implementa o contrato
export class BcryptHashingService implements HashingService {
  // Implementação do método hash do contrato
  async hash(password: string): Promise<string> {
    return hash(password, HASH_SALT_ROUNDS);
  }

  // Implementação do método compare (usado para login futuro)
  async compare(password: string, hashValue: string): Promise<boolean> {
    return compare(password, hashValue);
  }
}
