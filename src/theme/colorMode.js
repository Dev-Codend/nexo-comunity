import { ref } from "vue";

const storageKey = "adminzoom-color-mode";
const isDark = ref(false);

function applyMode() {
  document.documentElement.dataset.colorMode = isDark.value ? "dark" : "light";
  document.documentElement.style.colorScheme = isDark.value ? "dark" : "light";
}

export function initializeColorMode() {
  try {
    isDark.value = localStorage.getItem(storageKey) === "dark";
  } catch {
    isDark.value = false;
  }
  applyMode();
}

export function useColorMode() {
  function toggleColorMode() {
    isDark.value = !isDark.value;
    applyMode();
    try {
      localStorage.setItem(storageKey, isDark.value ? "dark" : "light");
    } catch {
      // Switching still works if browser storage is unavailable.
    }
  }
  return { isDark, toggleColorMode };
}
