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
  } catch (error: unknown) {
    // 1. MUDANÇA: Usamos 'unknown' em vez de 'any'

    // 2. VERIFICAÇÃO SEGURA (Type Guard)
    // O TypeScript agora sabe que dentro deste if, 'error' é definitivamente um ZodError
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    // 3. VERIFICAÇÃO SEGURA PARA ERROS COMUNS
    // Verificamos se é um objeto Error padrão antes de ler .message
    if (error instanceof Error) {
      if (error.message === "Invalid credentials") {
        return NextResponse.json({ message: error.message }, { status: 401 });
      }
    }

    // 4. REDE DE SEGURANÇA FINAL
    console.error("🚨 CRITICAL LOGIN SERVER ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
