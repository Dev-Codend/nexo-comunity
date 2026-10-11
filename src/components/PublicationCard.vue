<template>
  <div class="publication__box">
    <div
      style="
        position: absolute;
        right: 18px;
        cursor: pointer;
        font-size: 24px;
        font-weight: 900;
        color: var(--ocean-muted);
      "
      @click="setActive"
    >
      ...
    </div>

    <div class="modalSection" v-show="showCursor == 1">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template
          v-slot:activator="{ props }"
          v-if="publication.is_mine == true"
        >
          <div>
            <div class="buttons" v-if="publication.is_mine == true">
              <div class="btn edit" v-bind="props">
                <img
                  style="width: 7%; margin-right: 3px"
                  src="../img/editar.png"
                  alt=""
                />

                Editar Publicación
              </div>
              <div @click="removeTodo(publication.id)" class="btn delete" dark>
                <img
                  style="width: 7%; margin-right: 3px"
                  src="../img/basura.png"
                  alt=""
                />
                Eliminar Publicación
              </div>
            </div>
          </div>
        </template>
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-textarea v-model="editText" label="Info"></v-textarea>
                  <div class="btn__up__image">
                    <!-- <input class="sectionOne" type="button" value="Subir una imagen" /> -->
                    <input
                      :id="`edit-image-${publication.id}`"
                      type="file"
                      accept="image/*"
                      @change="updateImage"
                    />
                    <label
                      :for="`edit-image-${publication.id}`"
                      class="btn__image"
                    >
                      <svg
                        class="icono"
                        style="width: 24px; height: 24px"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M20,6A2,2 0 0,1 22,8V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4H10L12,6H20M10.75,13H14V17H16V13H19.25L15,8.75"
                        />
                      </svg>
                      subir imagen
                    </label>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="text" @click="dialog = false"
              >Cancelar</v-btn
            >
            <v-btn
              color="accent"
              variant="flat"
              @click="
                updatePublication(publication.id);
                dialog = false;
              "
              >Guardar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <div class="publication__box--infouser">
      <div class="publication__box--avatar">
        <img
          v-if="publication.user.photo != null"
          :src="publication.user.photo"
          alt="Perfil"
        />
        <img v-else src="../img/usuario.png" alt="Usuario" />
      </div>
      <div class="publication__box--name">
        <p class="formalitie-all">{{ publication.user.name }}</p>
      </div>
    </div>
    <div class="publication__box--text">
      <p style="font-size: 14px">{{ publication.text }}</p>
    </div>
    <div v-if="publication.image_url" class="publication__box--image">
      <img :src="publication.image_url" alt="" />
    </div>

    <!-- publication[image.image_url] -->
    <div
      style="
        display: flex;
        align-items: center;
        position: absolute;
        right: 21px;
      "
      :class="{ changeColor: publication.likes_count !== 0 }"
    >
      <p style="font-size: 14px">♡</p>
      <p style="font-size: 14px">{{ publication.likes_count }} likes</p>
    </div>
    <div class="createComment" @click="addComments(publication.id)">
      Comentar<img
        style="width: 12px; margin-left: 4px"
        src="../img/charla.png"
        alt="Usuario"
      />
    </div>
    <input
      style="
        border: 2px solid var(--ocean-border);
        width: 100%;
        border-radius: 14px;
        height: 40px;
        padding-left: 10px;
        font-size: 14px;
        outline: none;
      "
      type="text"
      v-model="textComment"
      placeholder="Escribir un comentario..."
    />

    <div class="comments">
      <comment
        class="comments__comment"
        v-for="(comment, index) in publication.comment"
        :key="comment.id"
        :index="index"
        :comment="comment"
      ></comment>
    </div>

    <div class="dad-optionLook" v-if="look">
      <p class="optionLook" @click="getComments(publication.id)">ver mas</p>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";
import Swal from "sweetalert2";
import Comment from "./Comment.vue";

import { mapState } from "pinia";
import { useAppStore } from "@/store";
export default {
  setup() {
    return { appStore: useAppStore() };
  },
  props: {
    publication: { required: true, type: Object },
  },
  data() {
    return {
      showCursor: 0,
      dialog: false,
      editText: "",
      dialogLol: false,
      dialogComm: false,
      data: false,
      look: true,
      subcoment: false,
      comments: [],
      image_post: null,
      postSubComment: "",
      textComment: "",
      saveComment: "",
    };
  },
  components: {
    Comment,
  },
  computed: {
    ...mapState(useAppStore, ["publications"]),
  },
  watch: {
    dialog(open) {
      if (open) {
        this.editText = this.publication.text;
        this.image_post = null;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.close);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.close);
  },
  methods: {
    updateImage(event) {
      this.image_post = event.target.files[0];
    },
    dialogCommit() {
      this.dialogComm = !this.dialogComm;
    },
    updatePublication(id) {
      const data = {
        id_post: id,
        id_company: this.publication.id_company,
        id_postimage: this.publication.id,
        text_post: this.editText,
      };

      if (this.image_post) {
        data.image_post = this.image_post;
      }

      this.appStore.updatePublication(data);
    },
    async getComments() {
      try {
        await this.appStore.getComments(this.publication);
        this.look = false;
      } catch {
        await Swal.fire({
          icon: "error",
          text: "No se pudieron cargar los comentarios.",
        });
      }
    },
    async addComments(id) {
      try {
        await api.post("/api/comment/create", {
          id_post: id,
          text_comment: this.textComment,
        });
        this.textComment = "";
        await this.appStore.getPublications();
      } catch {
        await Swal.fire({
          icon: "error",
          text: "No se pudo crear el comentario.",
        });
      }
    },

    setActive() {
      this.showCursor = !this.showCursor;
    },
    close(e) {
      if (!this.dialog && !this.$el.contains(e.target)) {
        this.showCursor = false;
      }
    },

    space() {
      this.subcoment = !this.subcoment;
    },
    removeTodo(id) {
      this.appStore.deletePublication(id);
    },
    removeComentarios(id) {
      this.appStore.deleteComentarios(id);
    },
  },
};
</script>

<style scoped>
.btn {
  padding: 12px;
  cursor: pointer;
  color: var(--ocean-ink);
}
.btn:hover {
  background: var(--ocean-ice);
}
.modalSection {
  position: absolute;
  background: var(--ocean-surface);
  right: 13px;
  top: 57px;
  border: 1px solid var(--ocean-border);
  width: 48%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 0 9px 1px rgba(0, 0, 0, 0.15);
  width: 205px;
}
.changeColor {
  color: var(--ocean-link, var(--ocean-deep));
}
.addComment {
  background: var(--ocean-deep);
  color: white;
  width: 21%;
  padding: 5px;
  border-radius: 7px;
  margin-bottom: 7px;
}
.deleteComment {
  color: var(--ocean-muted);
  width: 14%;
  border-radius: 7px;
  cursor: pointer;
  padding-top: 6px;
  padding-bottom: 6px;
  font-weight: 700;
}
.createComment {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-bottom: 6px;
}
.optionLook {
  display: flex;
  justify-content: center;
  color: var(--ocean-link, var(--ocean-deep));
  cursor: pointer;
}
.publication__box {
  width: 95%;
  height: auto;
  margin: 10px auto 20px auto;
  background: var(--ocean-gradient-surface);
  padding: 15px;
  position: relative;
  border: 1px solid var(--ocean-border);
  border-top: 0;
  border-radius: 12px;
  box-shadow: 0 8px 24px color-mix(in srgb, var(--ocean-deep) 10%, transparent);
  transition: box-shadow 180ms ease;
}

.publication__box::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 4px;
  border-radius: 12px 12px 0 0;
  background: var(--ocean-gradient-accent);
  pointer-events: none;
}

.publication__box:hover {
  box-shadow: 0 10px 30px color-mix(in srgb, var(--ocean-deep) 17%, transparent);
}
.publication__box--text {
  margin-top: 15px;
}
.publication__box--text p {
  word-break: break-all;
}
.publication__box--image {
  width: 100%;
  overflow: hidden;
  margin-top: 15px;
}
.publication__box--image img {
  width: 100%;
  height: 100%;
}
.buttons {
  width: 100%;
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
}

.publication__box--infouser {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--ocean-blue) 13%, transparent),
    color-mix(in srgb, var(--ocean-cyan) 8%, transparent) 65%,
    transparent
  );
}
.publication__box--avatar {
  width: 30px;
  height: 30px;
  border-radius: 50px;
  overflow: hidden;
  outline: 2px solid var(--ocean-cyan);
}
.publication__box--avatar img {
  width: 100%;
  height: 100%;
}
.publication__box--name p {
  padding: 12px 8px;
  font-weight: bold;
  font-size: 14.5px;
  color: var(--ocean-ink);
}
.v-application p {
  margin: 0;
}
.comments {
  width: 100%;
  min-height: 50px;
  height: auto;
  /* background-color: var(--ocean-border); */
}
.comments__comment {
  padding: 0 10px;
  width: 100%;
  height: auto;
  margin-top: 5px;
  margin-bottom: 2px;
}
.comments__comment--text {
  height: auto;
}
.sub__comments {
  width: 100%;
  min-height: 30px;
  height: auto;
}
.sub__comment {
  width: 95%;
  min-height: 20px;
  height: auto;
  padding: 0 20px;
}
.btn__up__image {
  position: relative;
  width: 150px;
  overflow: hidden;
  height: auto;
  z-index: 100;
}
.btn__image {
  border: 1.3px solid var(--ocean-cyan);
  display: flex;
  padding: 5px 15px;
  cursor: pointer;
  border-radius: 7px;
  color: var(--ocean-link, var(--ocean-deep));
  height: 38px;
}
.icono {
  margin-right: 10px;
}
input[type="file"] {
  display: none;
}
.formalitie-all {
  margin: 0;
}
@media (max-width: 730px) {
  .formalitie-all {
    font-size: 11px !important;
  }
}
</style>
