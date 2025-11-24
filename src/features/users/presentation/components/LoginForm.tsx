"use client";

import { useState } from "react";

export function LoginForm() {
  // Define o formato de erro detalhado que a rota retorna (Zod)
  type ErrorDetail = {
    code: string;
    message: string;
    path: string[];
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle"); // Array para mensagens
  const [messages, setMessages] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessages([]);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        let finalErrorMessages: string[] = [];

        // 1. Tratamento de Erros da API (400, 401, 409, 500)
        if (response.status === 400 && data.details) {
          // Erro Zod
          const zodErrors = data.details as ErrorDetail[];
          finalErrorMessages = zodErrors.map(
            (err) => `[${err.path.join(".") || "Geral"}]: ${err.message}`
          );
        } else {
          // Erro de Negócio (Login falhou, etc)
          finalErrorMessages = [data.message || "Erro desconhecido"];
        }

        // Atualizamos a UI e PARAMOS aqui. Não lançamos erro.
        setMessages(finalErrorMessages);
        setStatus("error");
        return;
      }

      // 2. Sucesso (200)
      setStatus("success");
      setMessages([`Login bem-sucedido! Bem-vindo, ${data.email}.`]);
      setEmail("");
      setPassword("");
    } catch (error: unknown) {
      // 3. Este bloco só roda se o fetch falhar (ex: servidor desligado)
      console.error(error);
      setStatus("error");
      setMessages([
        "Falha na conexão de rede. Verifique se o servidor está rodando.",
      ]);
    } finally {
      if (status !== "success" && status !== "error") {
        setStatus("idle"); // Reseta apenas se não definiu resultado final
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 border rounded shadow-md max-w-md mx-auto bg-white text-black"
    >
      <h2 className="text-xl font-bold mb-2">Acessar Conta</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
          placeholder="********"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {status === "loading" ? "Acessando..." : "Entrar"}
      </button>

      {/* Área de Feedback */}
      {messages.length > 0 && (
        <div
          className={`p-3 rounded text-sm ${
            status === "error"
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      )}
    </form>
  );
}
