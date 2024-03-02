# Horext SSR Client

> Horext app built using [Nuxt 3](https://github.com/nuxt/nuxt), [Vue 3](https://github.com/vuejs/core), [Vuetify 3](https://github.com/vuetifyjs/vuetify), and [TypeScript](https://github.com/microsoft/TypeScript).

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/) (>= 20.x)
- [Pnpm](https://pnpm.io/installation)

### Install dependencies

```bash
pnpm install
```

### Create .env file

- Copy .env.example to .env file via command below

```bash
cp .env.example .env
```

- Fill in the environment variables in the .env file
- If you want to use the default value, you can skip this step

### Run development server

Start the development server on `http://localhost:3030`:

```bash
pnpm dev
```

## Build Setup

Build the application for production:

```bash
# install dependencies
$ pnpm install

# build for production
$ pnpm build

# locally preview production build
$ pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
