FROM node:20-alpine

RUN apk add --no-cache \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    python3 \
    && npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 4002

ENV PORT=4002

CMD ["pnpm", "start"]
