// Keep the previous palette available while trying the new reference.
export const oceanPalette = {
  deep: "#0B10B5",
  navy: "#080D75",
  blue: "#2D88DD",
  cyan: "#40C5E7",
  ice: "#CAF7FB",
  yellow: "#EFF23B",
  lemon: "#FFF67A",
  gold: "#FFD21F",
  amber: "#F3A500",
  background: "#EDF8FF",
  surface: "#FAFEFF",
  tint: "#E1F3FC",
  border: "#B4DCEE",
  ink: "#102A69",
  muted: "#416493",
};

export const editorialPalette = {
  deep: "#862449",
  navy: "#211A20",
  blue: "#FF3D59",
  cyan: "#FFB86C",
  ice: "#FFD0ED",
  yellow: "#FFBE78",
  lemon: "#FFE7BF",
  gold: "#FFAE63",
  amber: "#F17C54",
  background: "#F2EEE3",
  surface: "#FFFCF7",
  tint: "#F8E9E3",
  border: "#DEC5C5",
  ink: "#302529",
  muted: "#785C67",
};

export const communityPalette = {
  deep: "#12665D",
  navy: "#243B36",
  blue: "#369889",
  cyan: "#75BCA8",
  ice: "#E5F1E9",
  yellow: "#FF8066",
  lemon: "#FFA18A",
  gold: "#FF8D73",
  amber: "#FF8066",
  highlight: "#F3D66A",
  background: "#FFF8EE",
  surface: "#FFFEFA",
  tint: "#F3F6EF",
  border: "#D6E3D8",
  ink: "#243B36",
  muted: "#526C62",
};

export const sunsetPalette = {
  dark: true,
  deep: "#8D2D56",
  navy: "#0D050E",
  blue: "#A3445D",
  cyan: "#D53C3C",
  ice: "#2B193E",
  yellow: "#D53C3C",
  lemon: "#D53C3C",
  gold: "#C53545",
  amber: "#A3445D",
  highlight: "#A3445D",
  background: "#0D050E",
  surface: "#211329",
  tint: "#2B193E",
  border: "#57304F",
  ink: "#F8EDF3",
  muted: "#C8ADC0",
  link: "#F0B2CB",
  onPrimary: "#FFFFFF",
  onAccent: "#FFFFFF",
};

export const floralPalette = {
  dark: false,
  deep: "#813D53",
  navy: "#405355",
  blue: "#AD5E4E",
  cyan: "#DCA77E",
  ice: "#EDD5C5",
  yellow: "#813D53",
  lemon: "#DCA77E",
  gold: "#AD5E4E",
  amber: "#813D53",
  highlight: "#DCA77E",
  background: "#F0E7E2",
  surface: "#FBF5EF",
  tint: "#EDD5C5",
  border: "#D6B7A7",
  ink: "#304344",
  muted: "#6D5A55",
  link: "#813D53",
  onPrimary: "#FFFFFF",
  onAccent: "#FFFFFF",
};

export const tropicalPalette = {
  dark: false,
  deep: "#5D064C",
  navy: "#062E46",
  blue: "#07578E",
  cyan: "#C90BA2",
  ice: "#E5ECF7",
  yellow: "#C90BA2",
  lemon: "#C90BA2",
  gold: "#8B3C80",
  amber: "#5D064C",
  highlight: "#C90BA2",
  background: "#F0F4FB",
  surface: "#FCFCFF",
  tint: "#EDE4F3",
  border: "#C6C8E3",
  ink: "#14354D",
  muted: "#586780",
  link: "#07578E",
  onPrimary: "#FFFFFF",
  onAccent: "#FFFFFF",
};

export const neonPalette = {
  dark: false,
  deep: "#123F78",
  navy: "#032247",
  blue: "#123F78",
  cyan: "#09B6D8",
  ice: "#DEF4FC",
  yellow: "#EC20B4",
  lemon: "#FF7DEC",
  gold: "#FF7DEC",
  amber: "#EC20B4",
  highlight: "#FF7DEC",
  background: "#EDF7FD",
  surface: "#FBFDFF",
  tint: "#F7E9FB",
  border: "#B7D5E8",
  ink: "#032247",
  muted: "#4C627F",
  link: "#123F78",
  onPrimary: "#FFFFFF",
  onAccent: "#032247",
};

export const palette = neonPalette;

export function applyPalette() {
  // Existing CSS names act as shared roles for both palettes.
  for (const [name, color] of Object.entries(palette)) {
    if (typeof color !== "string") continue;
    document.documentElement.style.setProperty(`--ocean-${name}`, color);
  }
  document.documentElement.style.colorScheme = palette.dark ? "dark" : "light";
}
