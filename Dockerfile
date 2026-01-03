# Multi-stage build for SvelteKit static site
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Sync SvelteKit and build (prerender) static site
RUN npx svelte-kit sync && npm run build

# Production stage: nginx serving static files like S3 would
FROM nginx:stable-alpine AS runner

# Copy custom nginx config (expects it to be added to repo)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default html content and copy our build output
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html

# Create non-root user and set permissions
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup && \
    chown -R appuser:appgroup /usr/share/nginx/html /var/cache/nginx /var/run /var/log/nginx && \
    touch /run/nginx.pid && \
    chown appuser:appgroup /run/nginx.pid

# Switch to non-root user
USER appuser

# Expose HTTP
EXPOSE 80

# Optional: simple healthcheck hitting root
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1

# Run nginx (default CMD from base image)
