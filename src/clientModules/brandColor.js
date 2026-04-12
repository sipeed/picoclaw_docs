import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

function applyBrandColors() {
  document.querySelectorAll('.navbar__title').forEach((el) => {
    if (el.querySelector('.brand-pico')) return; // already processed
    const text = el.textContent || '';
    if (!text.startsWith('PicoClaw')) return;
    el.innerHTML =
      '<span class="brand-pico">Pico</span><span class="brand-claw">Claw</span>';
  });
}

if (ExecutionEnvironment.canUseDOM) {
  // Apply on initial load and after route changes (SPA navigation).
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBrandColors);
  } else {
    applyBrandColors();
  }
}

export function onRouteDidUpdate() {
  applyBrandColors();
}
