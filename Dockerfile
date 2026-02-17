# Build Stage
FROM node:18-alpine AS build-stage
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with increased memory
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm ci --only=production=false

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production Stage
FROM nginx:stable-alpine AS production-stage

# Copy built files
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Create nginx configuration for SPA
RUN echo 'server { \
    listen 8080; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
