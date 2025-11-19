// src/features/users/application/user.repository.interface.ts

// O tipo de dados que o Repositório RETORNA (tem ID)
export type UserSaveData = {
  id: string; // ID é obrigatório para o dado retornado/salvo
  email: string;
  password: string;
};

// O tipo de dados que o Repositório RECEBE para criação (SEM ID)
export type UserCreateData = Omit<UserSaveData, "id">; // Remove 'id' de UserSaveData

// A interface que define o CONTRATO
export interface UserRepository {
  // Agora o save RECEBE UserCreateData e RETORNA UserSaveData
  save(user: UserCreateData): Promise<UserSaveData>;

  findByEmail(email: string): Promise<UserSaveData | null>;
}
