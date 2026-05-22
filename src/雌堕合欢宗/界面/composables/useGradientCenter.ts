import { onMounted, onUnmounted } from 'vue';

/**
 * 动态渐变中心追踪
 * 根据内容区域滚动位置动态调整 --gradient-center-x/y CSS变量
 * 实现金册幽光随阅读位置移动的视觉效果
 */
export function useGradientCenter(selector = '.content-area') {
  function update() {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollRatio = el.scrollTop / (el.scrollHeight - rect.height || 1);
    // X 固定居中，Y 随滚动从 30% 移到 70%
    const centerX = 50;
    const centerY = 30 + scrollRatio * 40;
    el.style.setProperty('--gradient-center-x', centerX + '%');
    el.style.setProperty('--gradient-center-y', centerY + '%');
  }

  onMounted(() => {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) return;
    el.addEventListener('scroll', update, { passive: true });
    update();
  });

  onUnmounted(() => {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) return;
    el.removeEventListener('scroll', update);
  });
}
