# Step 1: Base Image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Step 2: Dependency Installation
FROM base AS deps

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install prisma
RUN prisma init
RUN prisma generate
RUN npm install --production

# Step 3: Build Stage
FROM base AS builder

# Copy dependencies from the previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application files
COPY . .

# Disable telemetry and set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build the Next.js application
RUN npm run build

# Step 4: Final Image for Running the Application
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Set environment variables for production
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Add a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 8080

# Set the port environment variable (Cloud Run uses this)
ENV PORT 8080

# Start the application
CMD ["npm", "start"]
