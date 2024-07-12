FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Install production dependencies
FROM base AS prodDeps
WORKDIR /app
COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/yarn.lock /app/
RUN yarn install --production

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/yarn.lock /app/
COPY --from=prodDeps /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

EXPOSE 8000
CMD ["yarn", "start:prod"]