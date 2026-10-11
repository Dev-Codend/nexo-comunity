<template>
  <div class="dashboard">
    <Navigator />
    <div class="publication">
      <publication-send />
    </div>
    <div class="publication gris" id="publications">
      <div class="btn__control">
        <input type="button" value="Atras" @click="previusPage" />
        <input type="button" value="Siguiente" @click="nextPage" />
      </div>
      <div>
        <loading v-if="mostrarCard"></loading>
        <template v-else>
          <publication-card
            v-for="publi in publications"
            :key="publi.id"
            :publication="publi"
          />
        </template>
      </div>
      <div class="btn__control">
        <input type="button" value="Atras" @click="previusPage" />
        <input type="button" value="Siguiente" @click="nextPage" />
      </div>
    </div>
  </div>
</template>

<script>
import Navigator from "@/components/Navigator.vue";
import loading from "@/components/loading.vue";

import PublicationCard from "@/components/PublicationCard.vue";
import PublicationSend from "@/components/PublicationSend.vue";
import { mapState } from "pinia";
import { useAppStore } from "@/store";

export default {
  setup() {
    return { appStore: useAppStore() };
  },
  name: "Dashboard",

  data() {
    return {
      // publications: []
    };
  },
  created() {},
  mounted() {
    this.appStore.getPublications();
  },

  computed: {
    ...mapState(useAppStore, ["publications"]),
    ...mapState(useAppStore, ["mostrarCard"]),
  },
  components: {
    PublicationCard,
    PublicationSend,
    Navigator,
    loading,
  },
  methods: {
    nextPage() {
      let publicaciones = document.getElementById("publications");

      this.appStore.nextPage();
      this.appStore.getPublications();
      publicaciones.scrollTop = 0;
    },
    previusPage() {
      let publicaciones = document.getElementById("publications");

      this.appStore.previusPage();
      this.appStore.getPublications();
      publicaciones.scrollTop = 0;
    },
  },
};
</script>

<style scoped>
#loader {
  position: absolute;
  top: calc(50% - 20px);
  left: calc(24% - 20px);
}
@media (max-width: 730px) {
  #loader {
    top: calc(68% - 20px);
    left: calc(51% - 20px);
  }
}
::-webkit-scrollbar {
  display: none;
}
.dashboard {
  width: 100%;
  margin: 0px auto;
  display: flex;
}

.linea {
  height: calc(100vh - 100px);
  border: 0.5px solid var(--ocean-border);
  margin: 20px 0 0 15px;
}
.publication {
  width: 100%;
  margin: 0;
  height: calc(100vh - 66px);
  overflow: scroll;
  padding: 10px;
  background: var(--floral-gradient-base);
}

.gris {
  background:
    radial-gradient(
      ellipse at 0% 30%,
      color-mix(in srgb, var(--ocean-cyan) 20%, transparent),
      transparent 60%
    ),
    var(--floral-gradient-base);
  order: -1;
}
.btn__control {
  display: flex;
  justify-content: space-between;
}
.btn__control input {
  padding: 0 15px;
  outline: none;
  color: var(--ocean-link, var(--ocean-deep));
  background: linear-gradient(120deg, var(--ocean-surface), var(--ocean-ice));
  border: 1px solid var(--ocean-border);
  border-radius: 6px;
  padding-block: 5px;
  cursor: pointer;
}

@media (max-width: 730px) {
  .dashboard {
    display: grid;
  }
  .btn__control input {
    font-size: 12px;
  }
}
@media (max-width: 730px) {
  .publication {
    grid-row: 1;
    height: auto;
  }
}

@media (max-width: 730px) {
  .gris {
    grid-row: 2;
  }
}
</style>
