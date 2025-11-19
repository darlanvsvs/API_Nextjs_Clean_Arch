// Define a estrutura mínima de dados que um usuário deve ter ao ser salvo
export type UserSaveData = {
  id: string;
  email: string;
  password: string; // Hash
};

// Interface que define o CONTRATO para salvar um usuário.
// O 'Application' layer só conhece esta interface, não sabe qual banco será usado.
export interface UserRepository {
  // Método que salva o usuário
  save(user: UserSaveData): Promise<UserSaveData>;

  // Método que verifica se o email já existe (Regra de Negócio)
  findByEmail(email: string): Promise<UserSaveData | null>;
}
