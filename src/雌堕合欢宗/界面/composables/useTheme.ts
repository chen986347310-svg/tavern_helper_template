import { ref } from "vue";
type Theme = 'chenxiang' | 'taohua';
function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem('hh-theme');
    if (stored === 'chenxiang' || stored === 'taohua') return stored;
    const old = localStorage.getItem('theme');
    if (old === 'light') return 'taohua';
    return 'chenxiang';
  } catch {
    return 'chenxiang';
  }
}
const theme = ref<Theme>(getStoredTheme());
applyTheme(theme.value);
function applyTheme(t: Theme) {
  if (!document.documentElement.classList.contains('theme-transitioning')) {
    document.documentElement.classList.add('theme-transitioning');
  }
  document.documentElement.setAttribute('data-theme', t);
  void document.documentElement.offsetHeight;
  try { localStorage.setItem('hh-theme', t); } catch {}
  setTimeout(() => { document.documentElement.classList.remove('theme-transitioning'); }, 500);
}
export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'chenxiang' ? 'taohua' : 'chenxiang';
    applyTheme(theme.value);
  }
  return { theme, toggleTheme };
}
