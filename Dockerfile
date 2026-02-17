# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy all source files
COPY . .

# Build the app
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy custom nginx config
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx config for SPA and port 8080
RUN echo 'server { \
    listen 8080; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
    try_files $uri /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
