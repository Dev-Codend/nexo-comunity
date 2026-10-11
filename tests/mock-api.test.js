import test from "node:test";
import assert from "node:assert/strict";
import axios from "axios";
import { installMockApi } from "../src/mocks/api.js";

function createApi() {
  const api = axios.create();
  installMockApi(api);
  return api;
}

test("demo: autenticación y consultas sin backend", async () => {
  const api = createApi();
  await assert.rejects(
    api.post("/api/login", { studentCode: "", password: "" }),
  );
  const login = await api.post("/api/login", {
    studentCode: "demo",
    password: "demo",
  });
  assert.equal(login.data.data.user.id_type_user, 2);
  assert.ok(login.data.data.token);
  assert.equal((await api.get("/api/classroom/schedule")).data.data.length, 5);
  assert.equal(
    (await api.get("/api/formalities")).data.data.formalities.length,
    2,
  );
  assert.equal((await api.get("/api/companies")).data.length, 2);
  assert.equal((await api.post("/api/logout")).data.success, true);
  await assert.rejects(api.get("/api/unknown"));
});

test("demo: publicaciones, imágenes, comentarios, respuestas y paginación con Axios actual", async () => {
  const api = createApi();
  const form = new FormData();
  form.set("text_post", "Publicación de prueba");
  form.set("id_company", 2);
  form.append(
    "image_post",
    new Blob(["image"], { type: "image/png" }),
    "demo.png",
  );
  await api.post("/api/post/create", form);
  const list = async () => (await api.get("/api/posts")).data.data;
  let post = (await list())[0];
  assert.equal(post.text, "Publicación de prueba");
  assert.equal(post.id_company, 2);
  assert.match(post.image_url, /^blob:/);
  await api.post("/api/comment/create", {
    id_post: post.id,
    text_comment: "Comentario",
  });
  post = (await list())[0];
  const comment = post.comment[0];
  await api.post("/api/post_comment/create", {
    id_comment: comment.id,
    text_sub_comment: "Respuesta",
  });
  post = (await list())[0];
  const reply = post.comment[0].sub_comment[0];
  await api.post("/api/post_comment/edit", {
    id_subcomment: reply.id,
    text_comment: "Respuesta editada",
  });
  assert.equal(
    (await list())[0].comment[0].sub_comment[0].text,
    "Respuesta editada",
  );
  await api.post("/api/post_comment/delete", { id_subcomment: reply.id });
  assert.equal((await list())[0].comment[0].sub_comment.length, 0);
  await api.post("/api/comment/edit", {
    id_comment: comment.id,
    text_comment: "Comentario editado",
  });
  assert.equal((await list())[0].comment[0].text, "Comentario editado");
  await api.post("/api/comment/delete", { id_comment: comment.id });
  assert.equal((await list())[0].comment.length, 0);
  const update = new FormData();
  update.set("id_post", post.id);
  update.set("text_post", "Publicación editada");
  await api.post("/api/post/edit", update);
  assert.equal((await list())[0].text, "Publicación editada");
  assert.equal(
    (await api.get("/api/posts", { params: { page: 2 } })).data.data.length,
    0,
  );
  await api.post("/api/post/delete", { id_post: post.id });
  assert.equal((await list()).length, 2);
  assert.equal(
    (await api.get("/api/posts", { params: { company: 2 } })).data.data.length,
    1,
  );
});
