"use client";

import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      // 1. Chamada à nova API Route de Login
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 2. Erro 401 Unauthorized (Falha de Login) ou Erro 500
        if (response.status === 401) {
          setMessage("Credenciais inválidas. Tente novamente.");
        } else {
          setMessage(
            data.message || "Erro no servidor. Tente novamente mais tarde."
          );
        }

        // Lança o erro para o bloco catch
        throw new Error(data.message || "Falha na requisição.");
      }

      // 3. Sucesso!
      setStatus("success");
      setMessage(`Login bem-sucedido! Bem-vindo, ${data.email}.`);
      setPassword("");
    } catch (error: any) {
      // Este catch lida principalmente com erros de rede ou a exceção do bloco try
      if (status !== "error") {
        // Garante que a mensagem de sucesso não seja apagada
        setStatus("error");
      }
      if (!message) {
        // Se a mensagem não foi setada (ex: erro de rede puro)
        setMessage("Falha na conexão de rede.");
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
      {message && (
        <div
          className={`p-3 rounded text-sm ${
            status === "error"
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}
