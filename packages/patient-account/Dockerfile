FROM node:10-alpine as builder
ARG SCOPE
ENV NODE_ENV production
RUN apk add --update git
RUN npm install npm@6 --global --quiet
RUN mkdir -p /opt/target
WORKDIR /opt/src
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx lerna exec --scope $SCOPE mv nginx.conf /opt/target/
RUN npx lerna bootstrap --ci --scope $SCOPE --include-filtered-dependencies
RUN npx lerna run --scope $SCOPE build
RUN npx lerna exec --scope $SCOPE mv build /opt/target/

FROM nginx:alpine
EXPOSE 80
RUN apk add --update jq
COPY --from=builder /opt/target/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /opt/target/build /usr/share/nginx/html
RUN chown nginx.nginx /usr/share/nginx/html/ -R
CMD jq -nc 'env | with_entries(select(.key | test("^REACT_APP_")))' \
      | echo "window.process={env:$(cat)}" \
      > /usr/share/nginx/html/runtime-env.js \
    && nginx -g 'daemon off;'
