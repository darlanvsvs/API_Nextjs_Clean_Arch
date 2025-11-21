// src/features/users/presentation/actions/login-user-action.ts

import { NextResponse } from "next/server";
import { loginUserController } from "@/features/users/user.module";
import { ZodError } from "zod"; // Para futuros testes de validação

// A função que será chamada pelo route.ts
export async function loginUserAction(request: Request) {
  try {
    const body = await request.json();

    // 1. Chamamos o Caso de Uso de Login, que faz a verificação
    const user = await loginUserController.execute(body);

    // 2. Sucesso: Retorna status 200 (OK) e o objeto do usuário logado
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    // TRATAMENTO DE ERROS

    // 3. Erro de Validação de Domínio (Zod)
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", details: error.issues },
        { status: 400 } // Bad Request
      );
    }

    // 4. Erro de Aplicação (Regra de Negócio: Credenciais Inválidas)
    if (error.message === "Invalid credentials") {
      return NextResponse.json(
        { message: error.message },
        { status: 401 } // 401 Unauthorized (Padrão para falha de login)
      );
    }

    // 5. Erro genérico do servidor (Infraestrutura)
    console.error("🚨 CRITICAL LOGIN SERVER ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
