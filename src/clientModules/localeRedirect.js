import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const LOCALE_KEY = 'picoclaw_locale_redirected';

const LOCALE_PREFIXES = ['/zh-Hans/', '/pt-BR/'];

const LOCALE_MAP = [
  { prefix: 'zh', path: '/zh-Hans/' },
  { prefix: 'pt', path: '/pt-BR/' },
];

if (ExecutionEnvironment.canUseDOM) {
  const { pathname, hostname } = window.location;

  // Skip in dev mode (localhost / 127.0.0.1) — only default locale is served.
  const isDev = hostname === 'localhost' || hostname === '127.0.0.1';

  // Only redirect on the exact root page, never on already-localized paths.
  const isRoot = pathname === '/' || pathname === '';
  const alreadyLocalized = LOCALE_PREFIXES.some((p) => pathname.startsWith(p));

  if (!isDev && isRoot && !alreadyLocalized && !sessionStorage.getItem(LOCALE_KEY)) {
    sessionStorage.setItem(LOCALE_KEY, '1');

    const langs = navigator.languages ?? [navigator.language];
    for (const lang of langs) {
      const lower = lang.toLowerCase();
      const match = LOCALE_MAP.find((m) => lower.startsWith(m.prefix));
      if (match) {
        window.location.replace(match.path);
        break;
      }
    }
  }
}

export function onRouteDidUpdate() {
  // no-op — required for Docusaurus client module interface
}
