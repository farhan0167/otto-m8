// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';


// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Otto-m8',
  tagline: "Flowchart-like UI to interconnect LLM's and Huggingface models, and deploy them as a REST API with little to no code.",
  favicon: 'img/otto-m8_logo.png',

  // Set the production url of your site here
  url: 'https://otto-m8.netlify.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'farhan0167', // Usually your GitHub org/user name.
  projectName: 'otto-m8', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/farhan0167/otto-m8-docs',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        {name: 'keywords', content: 'ai, aiagent, no-code, low-code, ollama, huggingface, chatbot, api, automation, rest api' },
        {name: 'description', content: 'Otto-m8 provides a flowchart-like UI to interconnect LLMs and Huggingface models, and deploy them as a REST API with little to no code.' },
        {name: 'author', content: 'farhan0167' },
        {name: 'og:title', content: 'Otto-m8' },
        {name: 'og:github', content: 'https://github.com/farhan0167/otto-m8' },
      ],
      // Replace with your project's social card
      image: 'img/otto-m8_logo.png',
      navbar: {
        title: 'otto-m8',
        logo: {
          alt: 'My Site Logo',
          src: 'img/otto-m8_logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'right',
            label: 'Documentation',
          },
          //{to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/farhan0167/otto-m8',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/introduction',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/g47wvNprfq',
              },
              {
                label: 'Linkedin',
                href: 'https://www.linkedin.com/in/farhan0167/',
              }
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Otto-m8. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
