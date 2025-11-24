import { test, expect } from "@playwright/test";

test("Login Flow - Sucesso e Falha", async ({ page }) => {
  // 1. CONFIGURAR O MOCK ANTES DA NAVEGAÇÃO
  await page.route("**/api/login", async (route) => {
    const request = route.request();
    const postData = request.postDataJSON();

    if (postData.password === "senhaerrada") {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Credenciais inválidas" }),
      });
    } else {
      await route.continue();
    }
  });

  // 1. Acessar a página de Login
  await page.goto("http://localhost:3000/login");

  // 2. Cenário de Erro: Senha errada
  await page.fill('input[type="email"]', "clean.arch.success@code.com");
  await page.fill('input[type="password"]', "senhaerrada");
  await page.click('button[type="submit"]');

  // Espera a mensagem de erro aparecer
  await expect(page.locator("text=Credenciais inválidas")).toBeVisible();

  // 3. Cenário de Sucesso: Senha correta
  await page.fill('input[type="password"]', "senhaforte123"); // Limpa e preenche
  await page.click('button[type="submit"]');

  // Espera a mensagem de sucesso
  await expect(page.locator("text=Login bem-sucedido!")).toBeVisible();
});
