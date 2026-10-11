<template>
  <div class="send">
    <form @submit.prevent="sendPublication">
      <div class="dashboardPublication">
        <textarea
          id="text-publication"
          class="dashboardPublication-itemOne"
          style="resize: none"
          placeholder="Ingresar texto...."
          v-model="textPublication"
        ></textarea>
        <div class="dashboardPublication-itemTwo">
          <div class="btn__up__image">
            <!-- <input class="sectionOne" type="button" value="Subir una imagen" /> -->
            <input
              id="boton"
              type="file"
              accept="image/*"
              @change="imageSelected"
            />
            <label for="boton" class="btn__image">
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
              Subir imagen
            </label>
          </div>

          <div>
            <input
              :disabled="submitting"
              type="submit"
              class="sectionTwo"
              value="Publicar"
            />
          </div>
        </div>
      </div>
      <select id="selectCompany" v-model="idCompany" class="select__company">
        <option value="0">Seleccionar Compañia...</option>
        <option
          v-for="(company, index) in companies"
          :key="index"
          :value="company.id"
        >
          {{ company.name }}
        </option>
      </select>
    </form>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useAppStore } from "@/store";
export default {
  setup() {
    return { appStore: useAppStore() };
  },
  name: "Publication",
  data() {
    return {
      textPublication: "",
      image_post: null,
      idCompany: "0",
      submitting: false,
    };
  },
  mounted() {
    this.appStore.getCompanies();
  },
  computed: {
    ...mapState(useAppStore, ["companies"]),
  },
  methods: {
    imageSelected(event) {
      this.image_post = event.target.files[0];
    },
    async sendPublication() {
      this.submitting = true;
      try {
        const saved = await this.appStore.sendPublication({
          text_post: this.textPublication,
          image_post: this.image_post,
          id_company: this.idCompany,
        });
        if (saved) {
          this.textPublication = "";
          this.image_post = null;
          this.$el.querySelector('input[type="file"]').value = "";
        }
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
@media (max-width: 730px) {
  .dashboardChange {
    font-size: 21px;
  }
}
.send {
  padding: 20px;
  border: 1px solid var(--ocean-border);
  border-top: 4px solid var(--ocean-cyan);
  border-radius: 12px;
  background: var(--ocean-gradient-surface);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--ocean-blue) 12%, transparent);
}
.dashboardPublication {
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 247px 77px;
}
@media (max-width: 730px) {
  .dashboardPublication {
    grid-template-rows: 98px 56px;
  }
}
.dashboardPublication-itemOne {
  grid-column: span 2;
  border: 1px solid var(--ocean-border);
  border-radius: 5px;
  padding: 14px 12px 12px 12px;
  outline: none;
  color: var(--ocean-ink);
  background: linear-gradient(
    145deg,
    var(--ocean-surface),
    color-mix(in srgb, var(--ocean-surface) 80%, var(--ocean-deep))
  );
}
.dashboardPublication-itemTwo {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn__up__image {
  position: relative;
  width: auto;
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
  background: linear-gradient(115deg, var(--ocean-ice), var(--ocean-surface));
}

@media (max-width: 730px) {
  .btn__image {
    border: 1.3px solid var(--ocean-cyan);
    display: flex;
    padding: 5px 9px 4px 4px;
    cursor: pointer;
    border-radius: 7px;
    color: var(--ocean-link, var(--ocean-deep));
    height: 31px;
    width: 116px;
    font-size: 11px;
    display: flex;
    align-items: center;
  }
}

.icono {
  margin-right: 10px;
}
input[type="file"] {
  display: none;
}
.sectionOne {
  width: 200px;
  border: 1px solid var(--ocean-border);
  height: 45px;
  outline: none;
  font-size: 18px;
}
.sectionTwo {
  background: var(--ocean-gradient-yellow);
  color: var(--ocean-onAccent, var(--ocean-navy));
  border-radius: 7px;
  width: 160px;
  height: 40px;
  font-size: 18px;
  outline: none;
  border: 0;
  font-weight: 700;
  box-shadow: 0 4px 14px color-mix(in srgb, var(--ocean-amber) 25%, transparent);
}

.sectionTwo:hover {
  background: var(--ocean-gradient-yellow-hover);
}

.sectionTwo:disabled {
  opacity: 0.6;
}
@media (max-width: 730px) {
  .sectionTwo {
    background: var(--ocean-gradient-yellow);
    width: 97px;
    font-size: 13px;
    height: 29px;
  }
}
.select__company {
  width: 187px;
  height: 35px;
  border: 1px solid var(--ocean-blue);
  padding: 5px;
  color: var(--ocean-ink);
  background: var(--ocean-ice);
  border-radius: 7px;
}
@media (max-width: 730px) {
  .select__company {
    width: 157px;
    height: 32px;
    font-size: 13px;
  }
}
</style>
