FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "--ignore-workspace", "start:dev"]