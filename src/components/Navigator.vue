<template>
  <v-navigation-drawer v-model="drawer" class="ocean-navigation">
    <v-list density="compact" nav>
      <v-list-item
        v-for="item in items"
        :key="item.text"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.text"
      />
    </v-list>
    <template #append>
      <div class="theme-switch-container">
        <button
          type="button"
          class="theme-switch"
          role="switch"
          :aria-checked="isDark"
          aria-label="Modo oscuro"
          @click="toggleColorMode"
        >
          <span class="theme-switch__badge" aria-hidden="true">
            <v-icon
              :icon="isDark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"
            />
          </span>
          <span class="theme-switch__copy">
            <span class="theme-switch__title">Apariencia</span>
            <span class="theme-switch__state">{{
              isDark ? "Modo nocturno" : "Modo claro"
            }}</span>
          </span>
          <span class="theme-switch__track" aria-hidden="true">
            <span class="theme-switch__thumb" />
          </span>
        </button>
      </div>
    </template>
  </v-navigation-drawer>
  <v-app-bar color="primary" height="64">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    <v-app-bar-title
      >AdminZoom <small v-if="demo">· Demo</small></v-app-bar-title
    >
    <v-btn variant="text" @click="destroyToken">Cerrar sesión</v-btn>
  </v-app-bar>
</template>

<script>
import { useAppStore } from "@/store";
import { isDemo } from "@/services/api";
import { useColorMode } from "@/theme/colorMode";

export default {
  setup() {
    return { appStore: useAppStore(), ...useColorMode() };
  },
  data: () => ({
    demo: isDemo,
    drawer: null,
    items: [
      { icon: "mdi-home", text: "Inicio", to: { name: "dashboard" } },
      { icon: "mdi-book-open-variant", text: "Cursos", to: { name: "cursos" } },
      {
        icon: "mdi-file-document-outline",
        text: "Documentos",
        to: { name: "documentos" },
      },
      {
        icon: "mdi-account-badge-outline",
        text: "CV",
        to: { name: "bolsalaboral" },
      },
    ],
  }),
  methods: {
    async destroyToken() {
      try {
        await this.appStore.logout();
      } finally {
        await this.$router.push({ name: "login" });
      }
    },
  },
};
</script>
