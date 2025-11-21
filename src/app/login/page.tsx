import { LoginForm } from "@/features/users/presentation/components/LoginForm";
// O Server Component importa o Client Component

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Acessar Conta
        </h1>

        {/* Renderiza o formulário interativo */}
        <LoginForm />
      </div>
    </main>
  );
}
