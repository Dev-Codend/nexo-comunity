<template>
  <div>
    <div
      v-if="comment.is_mine == true"
      style="display: flex; border-top: 1px solid var(--ocean-border)"
    >
      <div
        class="deleteComment"
        style="cursor: pointer; font-size: 12px; margin-right: 12px"
        @click="removeComentarios(comment.id)"
        dark
      >
        Eliminar
      </div>

      <div
        style="font-size: 12px"
        class="deleteComment"
        @click="openModal()"
        dark
      >
        Editar
      </div>
    </div>
    <div
      class="comments__comment--name"
      style="
        background: var(--ocean-tint);
        border-radius: 14px;
        padding-top: 5px;
        padding-left: 17px;
        font-size: 13px;
        padding-bottom: 6px;
        width: max-content;
        max-width: 100%;
        padding-right: 17px;
      "
    >
      <p class="commentsMobile">
        {{ comment.user.name }}
      </p>

      <p style="word-break: break-word; font-size: 12px; margin: 0px">
        {{ comment.text }}
      </p>
    </div>

    <div
      style="
        cursor: pointer;
        color: var(--ocean-muted);
        font-weight: 600;
        font-size: 11px;
        margin-left: 12px;
      "
      dark
      @click="addSubComments(comment.id)"
    >
      Responder
    </div>
    <input
      style="
        border: 2px solid var(--ocean-border);
        width: 97%;
        height: 30px;
        padding-left: 7px;
        font-size: 13px;
        border-radius: 14px;
        margin-left: 10px;
        outline: none;
      "
      type="text"
      placeholder="Escribe un Comentario"
      v-model="postSubComment"
    />

    <p
      style="
        color: var(--ocean-link, var(--ocean-deep));
        cursor: pointer;
        font-size: 12px;
        margin-left: 18px;
        margin-top: 0px;
        margin-bottom: 1px;
      "
      @click="space"
    >
      ver mas
    </p>

    <div class="sub__comments" v-show="subcoment == true">
      <subComment
        class="sub__comment"
        v-for="(subcomment, index) in comment.sub_comment"
        :key="index"
        :subcomment="subcomment"
      >
      </subComment>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";
import { useAppStore } from "@/store";
import Swal from "sweetalert2";
import subComment from "./subComment.vue";
export default {
  setup() {
    return { appStore: useAppStore() };
  },
  data() {
    return {
      dialogComm: false,
      postSubComment: "",
      subcoment: false,
    };
  },
  components: {
    subComment,
  },
  props: ["comment", "index"],
  methods: {
    async openModal() {
      const { value: text } = await Swal.fire({
        input: "textarea",
        inputValue: this.comment.text,
        inputPlaceholder: "Escribe tu mensaje aquí",
        inputAttributes: {
          "aria-label": "Escribe tu mensaje aquí",
        },
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
      });

      if (text) {
        await this.saveComentario(text);
      }
    },
    async removeComentarios() {
      await this.appStore.deleteComentarios(this.comment.id);
    },
    space() {
      this.subcoment = !this.subcoment;
    },
    async saveComentario(text) {
      try {
        const response = await api.post("/api/comment/edit", {
          id_comment: this.comment.id,
          text_comment: text,
        });

        if (response.data.success) {
          // await this.appStore.getPublications();
          await Swal.fire({
            icon: "success",
            title: "Finalizado",
            text: "Comentario actualizado correctamente.",
          });

          await this.appStore.getPublications();
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Hubo un problema",
          text: "No se actualizo el comentario correctamente",
        });
      }
    },
    async addSubComments(id) {
      try {
        await api.post("/api/post_comment/create", {
          id_comment: id,
          text_sub_comment: this.postSubComment,
        });
        this.postSubComment = "";
        await this.appStore.getPublications();
      } catch {
        await Swal.fire({
          icon: "error",
          text: "No se pudo guardar el comentario.",
        });
      }
    },
  },
};
</script>
<style scoped>
.commentsMobile {
  margin: 0;
  font-weight: bold;
  word-break: break-word;
}
@media (max-width: 730px) {
  .commentsMobile {
    font-size: 9px;
  }
}
</style>
