# ---------- BUILD STAGE ----------
FROM node:24-alpine AS builder

WORKDIR /app

# Install dev + prod dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Generate Prisma client and build Nest app
RUN npx prisma generate
RUN npm run build

# ---------- RUN STAGE ----------
FROM node:24-alpine AS runner

WORKDIR /app

# Only prod dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy build output and Prisma client from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
