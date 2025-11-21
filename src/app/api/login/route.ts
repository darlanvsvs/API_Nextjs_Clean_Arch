// src/app/api/login/route.ts (Apenas para o recurso /login)

// Importamos a Action de Login
import { loginUserAction } from "@/features/users/presentation/actions/login-user-action";

// A rota POST do Next.js se torna o nosso action (Controller)
export const POST = loginUserAction;
