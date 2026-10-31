# Wages & Expenses Manager: Node/Express serves public/ and the /api sync routes.
# Coolify builds from this file instead of Nixpacks. Nixpacks re-downloaded the
# whole Node toolchain after Coolify's nightly cache wipe and sometimes hung;
# this starts from the official Node image, so a deploy only runs npm ci + copy.
FROM node:22-alpine
WORKDIR /app

# Dependencies first (layer reused unless package files change)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
