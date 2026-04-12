// @ts-check
const { themes: prismThemes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'PicoClaw',
  tagline: 'Ultra-Efficient AI Assistant in Go — $10 Hardware · 10MB RAM · 1s Boot',
  favicon: 'favicon.ico',

  url: 'https://docs.picoclaw.io',
  baseUrl: '/',
  // Emit canonical URLs and a sitemap that match what GitHub Pages actually
  // serves (path/index.html). Without this, GitHub Pages 301-redirects
  // /docs/foo to /docs/foo/, which Google Search Console flags as
  // "Page with redirect".
  trailingSlash: true,

  organizationName: 'sipeed',
  projectName: 'picoclaw_docs',
  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-Hans', 'pt-BR'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
      'zh-Hans': {
        label: '中文',
        direction: 'ltr',
        htmlLang: 'zh-CN',
        // Pin the i18n folder path to "zh-Hans". Docusaurus 3.10 derives
        // the default path from htmlLang ?? locale, which would otherwise
        // make it "zh-CN" and silently ignore i18n/zh-Hans/.
        path: 'zh-Hans',
      },
      'pt-BR': {
        label: 'Português (Brasil)',
        direction: 'ltr',
        htmlLang: 'pt-BR',
      },
    },
  },

  clientModules: [
    require.resolve('./src/clientModules/localeRedirect.js'),
    require.resolve('./src/clientModules/brandColor.js'),
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/sipeed/picoclaw_docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      image: 'img/logo.webp',
      navbar: {
        title: 'PicoClaw',
        logo: {
          alt: 'PicoClaw Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'mainSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://picoclaw.io',
            label: 'Website',
            position: 'right',
          },
          {
            href: 'https://github.com/sipeed/picoclaw',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Getting Started', to: '/docs/getting-started' },
              { label: 'Configuration', to: '/docs/configuration' },
              { label: 'Chat Channels', to: '/docs/channels' },
            ],
          },
          {
            title: 'Community',
            items: [
              { label: 'Discord', href: 'https://discord.gg/V4sAZ9XWpN' },
              { label: 'GitHub Issues', href: 'https://github.com/sipeed/picoclaw/issues' },
              { label: 'GitHub Discussions', href: 'https://github.com/sipeed/picoclaw/discussions' },
            ],
          },
          {
            title: 'More',
            items: [
              { label: 'Roadmap', to: '/docs/roadmap' },
              { label: 'Contributing', to: '/docs/contributing' },
              { label: 'Releases', href: 'https://github.com/sipeed/picoclaw/releases' },
              { label: 'Sipeed GitHub', href: 'https://github.com/sipeed' },
              { label: 'Sipeed Twitter', href: 'https://x.com/SipeedIO' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Sipeed. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['go', 'json', 'bash'],
      },
    }),
};

config.themes = [
  [
    require.resolve('@easyops-cn/docusaurus-search-local'),
    /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
    ({
      hashed: true,
      language: ['en', 'zh', 'pt'],
      indexBlog: false,
      docsRouteBasePath: '/docs',
    }),
  ],
];

module.exports = config;
