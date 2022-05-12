FROM node:lts-alpine as builder
WORKDIR /srv
COPY . .
RUN set -x \
    && npm config set update-notifier false \
    && npm install \
    && npm run build \
    && npm run export \
    && rm -rf out
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start"]
