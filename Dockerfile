FROM node:lts-alpine as builder
WORKDIR /srv
COPY . .
RUN set -x \
    && npm config set update-notifier false \
    && npm install \
    && npm run build

FROM node:lts-alpine as executor
WORKDIR /srv
COPY --from=builder /srv .
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start"]
