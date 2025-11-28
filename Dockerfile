FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY package.json pnpm-lock.yaml ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY src ./src
COPY public ./public

# Build
RUN pnpm run build

FROM nginx:1.27-alpine AS runner
WORKDIR /usr/share/nginx/html

# Remove default static assets
RUN rm -rf ./*

COPY --from=builder /app/dist ./

# Minimal nginx config tweaks
RUN printf 'server { \
  listen 80; \
  server_name _; \
  root /usr/share/nginx/html; \
  location / { \
    try_files $$uri /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

