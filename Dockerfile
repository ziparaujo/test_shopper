FROM node:lts-alpine AS build
WORKDIR /app
COPY . . 
RUN npm install
RUN npm run build

FROM node:lts-alpine AS runner
USER node
WORKDIR /app
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
CMD ["node", "./dist/server.js"]
