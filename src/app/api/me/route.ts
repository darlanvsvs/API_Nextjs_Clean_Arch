// src/app/api/me/route.ts (GET /api/me - Rota Protegida)

import { NextResponse } from "next/server";
import { getAuthenticatedUserController } from "@/features/users/user.module";

// Esta é a função que extrai o token do cabeçalho de autorização.
function getTokenFromHeaders(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
}

// O Controlador (Presentation)
export async function GET(request: Request) {
  try {
    const token = getTokenFromHeaders(request);

    // 1. Chamamos o Use Case de Autorização
    // A lógica de Application/Domínio verifica o token e o usuário
    const user = await getAuthenticatedUserController.execute(token);

    // 2. Se o Use Case não lançar erro, o usuário está autenticado
    return NextResponse.json(
      {
        message: "Access granted",
        userId: user.id,
        email: user.email,
      },
      { status: 200 }
    );
  } catch (error: any) {
    // 3. Traduzir o erro de autenticação para 401 Unauthorized
    if (error.message === "Authentication required") {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Erro de Servidor (500)
    console.error("Error in GET /me:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
