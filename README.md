# PCL-Labs Platform

There are three versions of the repo

1. `main` - The main branch with the PCL-Labs platform code, this uses (NuxtHub)[https://hub.nuxt.com/] for deployment, a cloudflare D1 database and a cloudflare R2 bucket.
2. `postgres` - This branch is a 1 to 1 copy of the `main` branch but uses a postgres database and a custom S3 compatible blob storage.
3. `turso` - This branch is a 1 to 1 copy of the `main` branch but uses a turso database and a custom S3 compatible blob storage.

You can find PCL-Labs at - [https://paulchrisluke.com](https://paulchrisluke.com)

Docs - https://paulchrisluke.com

## Dev

Run the app locally

```bash
pnpm run dev
```


## Production

Build the application for production:

```bash
pnpm build
```
