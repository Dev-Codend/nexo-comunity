import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { palette } from "../theme/palette";

export default createVuetify({
  theme: {
    defaultTheme: "custom",
    themes: {
      custom: {
        dark: palette.dark || false,
        colors: {
          primary: palette.deep,
          secondary: palette.blue,
          accent: palette.yellow,
          background: palette.background,
          surface: palette.surface,
          "surface-variant": palette.tint,
          "on-surface": palette.ink,
          "on-background": palette.ink,
          "on-primary": palette.onPrimary || palette.surface,
          "on-secondary": palette.onPrimary || palette.surface,
          "on-accent": palette.onAccent || palette.navy,
          info: palette.blue,
          warning: palette.highlight || palette.yellow,
        },
      },
    },
  },
});
