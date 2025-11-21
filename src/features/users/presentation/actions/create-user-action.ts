import { NextRequest, NextResponse } from "next/server";
import { createUserController } from "@/features/users/user.module";
import { ZodError } from "zod";

export async function createUserAction(request: NextRequest) {
  try {
    const body = await request.json();

    // Chamamos o Caso de Uso, que faz a validação, hash e orquestração.
    const newUser = await createUserController.execute(body);

    // Sucesso: Retorna status 201 (Created)
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    // 1. Erro de Domínio (Validação Zod) -> HTTP 400
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    // 2. Erro de Regra de Negócio (Ex: Email já existe)
    if (error.message === "Email already exists") {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    // 3. Erro genérico (500)
    console.error("🚨 CRITICAL SERVER ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
