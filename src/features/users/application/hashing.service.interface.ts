// Define o contrato para qualquer serviço que forneça hash de senha
export interface HashingService {
  // Método para criar o hash da senha
  hash(password: string): Promise<string>;

  // Método para comparar (usaremos no futuro para login)
  compare(password: string, hash: string): Promise<boolean>;
}
