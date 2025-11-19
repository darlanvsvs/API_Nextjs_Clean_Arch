"use client";

import { useState } from "react";

// Define o formato de erro detalhado que a rota retorna (Zod)
type ErrorDetail = {
  code: string;
  message: string;
  path: string[];
};

export function UserForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [messages, setMessages] = useState<string[]>([]); // Array para mensagens

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessages([]); // Limpa o array no início

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        let finalErrorMessages: string[] = [];

        // 1. Processa Erro Zod Detalhado (400)
        if (response.status === 400 && data.details) {
          const zodErrors = data.details as ErrorDetail[];
          finalErrorMessages = zodErrors.map(
            (err) => `[${err.path.join(".") || "Geral"}]: ${err.message}`
          );
        }
        // 2. Processa Erro de Aplicação (409) ou Genérico (500)
        else {
          finalErrorMessages = [
            data.message || data.error || "Erro de Servidor",
          ];
        }

        // NOVO FLUXO: Seta o array de mensagens correto ANTES do throw
        setMessages(finalErrorMessages);

        // Lançamos um erro com um sinal genérico, que não será exibido na tela
        throw new Error("PROCESSED_API_ERROR");
      }

      // Sucesso
      setStatus("success");
      setMessages([`Usuário criado com ID: ${data.id}`]);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      // 3. O catch final apenas lida com o status e o caso de FALHA DE REDE PURA.
      setStatus("error");

      // Se o erro NÃO for o nosso sinal (ou seja, falhou antes da resposta), é um erro de rede.
      if (error.message !== "PROCESSED_API_ERROR") {
        setMessages(["Falha de conexão de rede. Verifique o servidor."]);
      }
    } finally {
      setStatus("idle");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 border rounded shadow-md max-w-md mx-auto bg-white text-black"
    >
      <h2 className="text-xl font-bold mb-2">Criar Nova Conta (Clean Arch)</h2>

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
          placeholder="******** (Mínimo 6 caracteres)"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {status === "loading" ? "Criando..." : "Cadastrar"}
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
