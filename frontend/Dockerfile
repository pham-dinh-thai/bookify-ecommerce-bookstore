FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@11.3.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "--ignore-workspace", "dev"]
