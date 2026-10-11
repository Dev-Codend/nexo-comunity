import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const baseURL = process.env.SMOKE_BASE_URL || "http://127.0.0.1:8080";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
page.setDefaultTimeout(10000);
const errors = [];
const apiRequests = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.text().includes("[Vue warn]")) errors.push(message.text());
});
page.on("request", (request) => {
  if (request.url().includes("/api/")) apiRequests.push(request.url());
});
const go = (path) => page.goto(baseURL + path);
const loginURL = /\/login(?:\?|$)/;
const confirm = async (name = "OK") => {
  await page.locator(".swal2-confirm").filter({ hasText: name }).click();
};
const publication = (text) =>
  page.locator(".publication__box").filter({ hasText: text });

try {
  await go("/dashboard");
  await page.waitForURL(loginURL);
  await page.getByRole("button", { name: "Acceder" }).click();
  await page.getByText("No se pudo iniciar sesión", { exact: true }).waitFor();
  await confirm();
  await page.getByPlaceholder("Nombre de Usuario").fill("demo");
  await page.getByPlaceholder("Contraseña").fill("demo");
  await page.getByRole("button", { name: "Acceder" }).click();
  await page.waitForURL("**/dashboard");
  await page.getByText("Bienvenidos a AdminZoom.", { exact: false }).waitFor();
  await page.locator("#text-publication").fill("Publicación de prueba UI");
  await page.locator("#selectCompany").selectOption("2");
  await page.locator("#boton").setInputFiles("src/img/usuario.png");
  await page.getByRole("button", { name: "Publicar", exact: true }).click();
  await confirm();
  let card = publication("Publicación de prueba UI");
  await card.waitFor();
  assert.match(
    await card.locator(".publication__box--image img").getAttribute("src"),
    /^blob:/,
  );
  await card
    .locator(".publication__box--image img")
    .evaluate((image) => image.decode());

  // Vuetify dialog: cancel must leave the original publication intact.
  await card.getByText("...", { exact: true }).click();
  await card.getByText("Editar Publicación", { exact: true }).click();
  await page.getByLabel("Info", { exact: true }).fill("Cambio cancelado");
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  await card.getByText("Publicación de prueba UI", { exact: true }).waitFor();
  await card.getByText("...", { exact: true }).click();
  await card.getByText("Editar Publicación", { exact: true }).click();
  await page.getByLabel("Info", { exact: true }).fill("Publicación editada UI");
  await page.getByRole("button", { name: "Guardar", exact: true }).click();
  await confirm();
  card = publication("Publicación editada UI");
  await card
    .getByPlaceholder("Escribir un comentario...")
    .fill("Comentario UI");
  await card.locator(".createComment").click();
  await card.getByText("Comentario UI", { exact: true }).waitFor();
  await card.locator(".optionLook").click();
  let comment = card
    .locator(".comments__comment")
    .filter({ hasText: "Comentario UI" });
  await comment.getByText("Editar", { exact: true }).click();
  await page.locator(".swal2-textarea").fill("Comentario editado UI");
  await confirm("Aceptar");
  await confirm();
  comment = card
    .locator(".comments__comment")
    .filter({ hasText: "Comentario editado UI" });
  await comment.getByPlaceholder("Escribe un Comentario").fill("Respuesta UI");
  await comment.getByText("Responder", { exact: true }).click();
  await comment.getByText("ver mas", { exact: true }).click();
  await comment.getByText("Respuesta UI", { exact: true }).waitFor();
  let reply = comment
    .locator(".sub__comment")
    .filter({ hasText: "Respuesta UI" });
  await reply.getByText("Editar", { exact: true }).click();
  await page.locator(".swal2-textarea").fill("Respuesta editada UI");
  await confirm("Aceptar");
  await confirm();
  // Reloading the feed remounts the comment: expand the replies again.
  await comment.getByText("ver mas", { exact: true }).click();
  reply = comment
    .locator(".sub__comment")
    .filter({ hasText: "Respuesta editada UI" });
  await reply.getByText("Eliminar", { exact: true }).click();
  await confirm("Eliminar");
  await reply.waitFor({ state: "hidden" });
  await comment
    .locator(":scope > div")
    .first()
    .getByText("Eliminar", { exact: true })
    .click();
  await confirm("Eliminar");
  await confirm();
  await comment.waitFor({ state: "hidden" });
  await card.getByText("...", { exact: true }).click();
  await card.getByText("Eliminar Publicación", { exact: true }).click();
  await confirm("Eliminar");
  await confirm();
  await card.waitFor({ state: "hidden" });

  await page
    .getByRole("button", { name: "Siguiente", exact: true })
    .first()
    .click();
  await page.locator(".publication__box").waitFor({ state: "hidden" });
  await page
    .getByRole("button", { name: "Atras", exact: true })
    .first()
    .click();
  await page.locator(".publication__box").first().waitFor();
  await mkdir("test-results", { recursive: true });
  await page.screenshot({ path: "test-results/dashboard.png", fullPage: true });

  // The sidebar control works with a keyboard and persists across reloads.
  const themeSwitch = page.getByRole("switch", { name: "Modo oscuro" });
  assert.equal(await themeSwitch.getAttribute("aria-checked"), "false");
  await themeSwitch.focus();
  await themeSwitch.press("Space");
  assert.equal(await themeSwitch.getAttribute("aria-checked"), "true");
  assert.equal(
    await page
      .getByRole("link", { name: "Cursos", exact: true })
      .locator(".v-icon")
      .evaluate((icon) => getComputedStyle(icon).color),
    "rgb(207, 179, 255)",
  );
  assert.equal(
    await page.evaluate(() => document.documentElement.dataset.colorMode),
    "dark",
  );
  await page.reload();
  await page.locator(".publication__box").first().waitFor();
  assert.equal(await themeSwitch.getAttribute("aria-checked"), "true");
  assert.equal(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--ocean-background")
        .trim(),
    ),
    "#15101f",
  );
  await page.screenshot({
    path: "test-results/dashboard-dark.png",
    fullPage: true,
  });

  // Navigate through the drawer, then exercise course details and their close event.
  await page.getByRole("link", { name: "Cursos", exact: true }).click();
  await page.waitForURL("**/cursos");
  assert.equal(await themeSwitch.getAttribute("aria-checked"), "true");
  assert.equal(await page.locator(".course__info").count(), 5);
  await page.locator(".course__info").first().click();
  await page.locator(".info__course").first().waitFor();
  await page.locator(".info__course .close").first().click();
  await page.locator(".info__course").first().waitFor({ state: "hidden" });
  await page.getByRole("link", { name: "Documentos", exact: true }).click();
  await page.getByText("Revisión de nota", { exact: true }).click();
  await page.getByText("Nombre: Estudiante Demo", { exact: true }).waitFor();
  await page.getByRole("link", { name: "CV", exact: true }).click();
  await page.getByRole("heading", { name: "CV", exact: true }).waitFor();
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await page.waitForURL(loginURL);
  await go("/dashboard");
  await page.waitForURL(loginURL);

  // Mobile viewport, direct route loading and the temporary navigation drawer.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByPlaceholder("Nombre de Usuario").fill("demo");
  await page.getByPlaceholder("Contraseña").fill("demo");
  await page.getByRole("button", { name: "Acceder" }).click();
  await page.waitForURL("**/dashboard");
  await page.locator(".v-app-bar-nav-icon").click();
  await themeSwitch.click();
  assert.equal(await themeSwitch.getAttribute("aria-checked"), "false");
  assert.equal(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--ocean-background")
        .trim(),
    ),
    "#eef4fc",
  );
  await themeSwitch.click();
  assert.equal(await themeSwitch.getAttribute("aria-checked"), "true");
  await page.getByRole("link", { name: "Cursos", exact: true }).click();
  await page.locator(".course__info").first().waitFor();
  await page.screenshot({
    path: "test-results/mobile-courses.png",
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  assert.deepEqual(apiRequests, []);
  console.log(
    "UI OK: login, rutas protegidas, imágenes, CRUD de publicaciones/comentarios/respuestas, diálogos, paginación, cursos, trámites, logout y móvil; sin errores Vue ni llamadas al backend.",
  );
} catch (error) {
  await mkdir("test-results", { recursive: true });
  await page.screenshot({ path: "test-results/failure.png", fullPage: true });
  console.error("URL:", page.url(), "Errores:", errors);
  throw error;
} finally {
  await browser.close();
}
