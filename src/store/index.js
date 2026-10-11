import { defineStore } from "pinia";
import api, { getToken, setToken } from "@/services/api";
import Swal from "sweetalert2";

async function notifyError(message) {
  await Swal.fire({ icon: "error", title: "Hubo un problema", text: message });
}
function publicationForm(params) {
  const form = new FormData();
  form.set("text_post", params.text_post);
  form.set("id_company", Number(params.id_company) || 1);
  if (params.id_post != null) form.set("id_post", params.id_post);
  if (params.id_postimage != null)
    form.set("id_postimage", params.id_postimage);
  if (params.image_post) form.append("image_post", params.image_post);
  return form;
}
export const useAppStore = defineStore("app", {
  state: () => ({
    token: getToken(),
    publications: [],
    companies: [],
    users: [],
    courses: [],
    schedules: [],
    infoCourses: [],
    formalities: [],
    page_publication: 1,
    mostrar: true,
    mostrarFormal: true,
    mostrarCard: true,
  }),
  actions: {
    async loadList(field, url, params, loadingFlag) {
      if (loadingFlag) this[loadingFlag] = true;
      try {
        const response = await api.get(url, { params });
        this[field] = response.data.data ?? response.data;
        return this[field];
      } catch {
        await notifyError(
          "No se pudieron cargar los datos. Comprueba la conexión con la API.",
        );
        return [];
      } finally {
        if (loadingFlag) this[loadingFlag] = false;
      }
    },
    getSchedule() {
      return this.loadList(
        "schedules",
        "/api/classroom/schedule",
        undefined,
        "mostrar",
      );
    },
    async getCourses() {
      const schedules = await this.getSchedule();
      this.courses = schedules.flatMap((day) => day.courses || []);
    },
    getInfoCourse(section = 93660) {
      return this.loadList("infoCourses", "/api/classroom/info_course", {
        section,
      });
    },
    getCompanies() {
      return this.loadList("companies", "/api/companies");
    },
    getUsers() {
      return this.loadList("users", "/api/profile");
    },
    async getFormalities() {
      this.mostrarFormal = true;
      try {
        const response = await api.get("/api/formalities");
        this.formalities = response.data.data.formalities;
      } catch {
        await notifyError("No se pudieron cargar los trámites.");
      } finally {
        this.mostrarFormal = false;
      }
    },
    getPublications() {
      return this.loadList(
        "publications",
        "/api/posts",
        { page: this.page_publication },
        "mostrarCard",
      );
    },
    getPublicationsFilter(company) {
      this.page_publication = 1;
      return this.loadList(
        "publications",
        "/api/posts",
        { company },
        "mostrarCard",
      );
    },
    async getComments(post) {
      const response = await api.get("/api/comments", {
        params: { id_post: post.id, id_comment: post.comment.at(-1)?.id || 0 },
      });
      const existing = new Set(post.comment.map((comment) => comment.id));
      post.comment.push(
        ...response.data.data.filter((comment) => !existing.has(comment.id)),
      );
    },
    async savePublication(params, edit = false) {
      try {
        const response = await api.post(
          edit ? "/api/post/edit" : "/api/post/create",
          publicationForm(params),
        );
        if (!response.data.success) throw new Error(response.data.message);
        this.page_publication = 1;
        await this.getPublications();
        await Swal.fire({
          icon: "success",
          title: edit ? "Publicación actualizada" : "Publicado correctamente",
        });
        return true;
      } catch {
        await notifyError("No se pudo guardar la publicación.");
        return false;
      }
    },
    sendPublication(params) {
      return this.savePublication(params);
    },
    updatePublication(params) {
      return this.savePublication(params, true);
    },
    async retrieveToken(credentials) {
      const response = await api.post("/api/login", credentials);
      if (!response.data.success || !response.data.data?.token) {
        throw new Error(response.data.message || "Credenciales incorrectas");
      }
      if (response.data.data.user.id_type_user === 1) {
        throw new Error("El usuario no es un profesor o colaborador.");
      }
      this.token = response.data.data.token;
      setToken(this.token);
      await Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true,
        icon: "success",
        title: "Sesión iniciada",
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
      return response;
    },
    async logout() {
      try {
        await api.post("/api/logout");
      } catch {
        // Clear the local session even when the server cannot be reached.
      } finally {
        this.token = null;
        setToken(null);
        this.$reset();
      }
    },
    async deleteRecord(url, payload, title) {
      const result = await Swal.fire({
        title,
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      });
      if (!result.isConfirmed) return;
      try {
        const response = await api.post(url, payload);
        if (!response.data.success) throw new Error(response.data.message);
        await this.getPublications();
        await Swal.fire({ icon: "success", title: "Eliminado correctamente" });
      } catch {
        await notifyError("No se pudo eliminar el registro.");
      }
    },
    deletePublication(id) {
      return this.deleteRecord(
        "/api/post/delete",
        { id_post: id },
        "Eliminar publicación",
      );
    },
    deleteComentarios(id) {
      return this.deleteRecord(
        "/api/comment/delete",
        { id_comment: id },
        "Eliminar comentario",
      );
    },
    nextPage() {
      this.page_publication++;
    },
    previusPage() {
      this.page_publication = Math.max(1, this.page_publication - 1);
    },
  },
});
