import { UserForm } from "@/features/users/presentation/components/UserForm";
// O Next.js Server Component importa o Client Component

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Criar Conta (Clean Arch)
        </h1>

        {/* Renderiza o formulário interativo */}
        <UserForm />
      </div>
    </main>
  );
}
