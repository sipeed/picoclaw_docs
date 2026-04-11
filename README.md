# PicoClaw Documentation

This repository contains the source for the [PicoClaw documentation site](https://sipeed.github.io/picoclaw_docs/).

## Development with GitHub Codespaces (Recommended)

The easiest way to contribute — no local setup required.

1. Fork this repository
2. Click **Code → Codespaces → Create codespace on main**
3. Wait for the container to build and dependencies to install automatically
4. Run the dev server:

```bash
# English (default)
npm start

# Chinese
npm run start:zh
```

> **Note:** Docusaurus dev server only serves one locale at a time. Use `npm start` for English or `npm run start:zh` for Chinese. Visiting `/zh-Hans/...` while running `npm start` will return 404.

The preview will open automatically in your browser. The dev server supports hot reload, so changes to docs are reflected instantly.

## Local Development

```bash
npm install

# English (default)
npm start

# Chinese
npm run start:zh
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Build

```bash
npm run build
```

## Deploy

This site automatically deploys to GitHub Pages on every push to `main` via GitHub Actions.

To enable deployment in a new repository:
1. Go to **Settings → Pages**
2. Set **Source** to **GitHub Actions**
3. Push to `main`

## Contributing

Content is sourced from and synchronized with the main [sipeed/picoclaw](https://github.com/sipeed/picoclaw) repository.

To update documentation, open a PR with the updated Markdown files.

## Structure

```
docs/           English documentation (default locale)
i18n/zh-Hans/   Chinese documentation
src/            Custom React pages and CSS
static/img/     Images and assets
```
