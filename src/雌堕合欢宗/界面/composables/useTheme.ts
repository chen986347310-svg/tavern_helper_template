import { ref } from 'vue';

type Theme = 'dark' | 'light';

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem('theme');
    return stored === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

const theme = ref<Theme>(getStoredTheme());

// Apply theme immediately on module load
applyTheme(theme.value);

function applyTheme(t: Theme) {
  // Guard against rapid toggling
  if (!document.documentElement.classList.contains('theme-transitioning')) {
    document.documentElement.classList.add('theme-transitioning');
  }
  document.documentElement.setAttribute('data-theme', t);
  // Force immediate style recalculation so scoped component styles
  // re-resolve CSS custom properties (--npc-accent, --theme-*) right away.
  void document.documentElement.offsetHeight;
  try {
    localStorage.setItem('theme', t);
  } catch {}
  // Remove transition class after animation completes
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning');
  }, 350);
}

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    applyTheme(theme.value);
  }

  return { theme, toggleTheme };
}
