/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  mainSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'doc',
      id: 'getting-started',
      label: 'Getting Started',
    },
    {
      type: 'doc',
      id: 'installation',
      label: 'Installation',
    },
    {
      type: 'category',
      label: 'Configuration',
      collapsible: true,
      collapsed: false,
      link: { type: 'doc', id: 'configuration/index' },
      items: [
        'configuration/model-list',
        'configuration/security-sandbox',
        'configuration/heartbeat',
        'configuration/tools',
        'configuration/config-reference',
      ],
    },
    {
      type: 'category',
      label: 'Chat Channels',
      collapsible: true,
      collapsed: true,
      link: { type: 'doc', id: 'channels/index' },
      items: [
        'channels/telegram',
        'channels/discord',
        'channels/slack',
        'channels/qq',
        'channels/dingtalk',
        'channels/wecom-bot',
        'channels/wecom-app',
        'channels/wecom-aibot',
        'channels/feishu',
        'channels/line',
        'channels/onebot',
        'channels/matrix',
        'channels/maixcam',
      ],
    },
    {
      type: 'category',
      label: 'Providers',
      collapsible: true,
      collapsed: true,
      link: { type: 'doc', id: 'providers/index' },
      items: [
        'providers/antigravity',
        'providers/antigravity-usage',
      ],
    },
    {
      type: 'category',
      label: 'Migration',
      collapsible: true,
      collapsed: true,
      items: ['migration/model-list-migration'],
    },
    {
      type: 'category',
      label: 'Development',
      collapsible: true,
      collapsed: true,
      items: [
        'design/provider-refactoring',
        'contributing',
        'roadmap',
      ],
    },
  ],
};

module.exports = sidebars;
