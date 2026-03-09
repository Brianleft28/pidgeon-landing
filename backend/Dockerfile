FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Use npm install here to avoid failing when package-lock.json is out of sync during CI builds
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# install only production deps in final image
RUN npm install --production --no-audit --no-fund
COPY --from=builder /app/dist ./dist
EXPOSE 3000
ENV NODE_ENV=production
# If TYPEORM_MIGRATIONS_RUN=true the container will attempt to run migrations before starting
CMD ["sh", "-c", "if [ \"$TYPEORM_MIGRATIONS_RUN\" = \"true\" ]; then npx typeorm migration:run -d dist/src/db/data-source.js || true; fi; node dist/main"]
