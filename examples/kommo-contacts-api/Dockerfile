FROM node:20-alpine

# Install system dependencies for better caching
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with cache optimization
RUN npm ci --only=production && npm cache clean --force

# Copy source code (this layer changes most frequently)
COPY . .
# Build timestamp: 2025-06-01-04-37

# Force rebuild - updated for port 80 and node index.js
# Use non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 80

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index.js"] 