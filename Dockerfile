FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

RUN npm ci

COPY src ./src

RUN npx prisma generate

# No need to build, we'll use tsx
# RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install tsx in production
RUN npm ci --only=production && npm install tsx

COPY prisma ./prisma/
COPY src ./src

RUN npx prisma generate

EXPOSE 8000

# Use tsx instead of node
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/seed.ts && npx tsx src/server.ts"]
