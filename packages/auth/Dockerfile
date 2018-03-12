FROM node:alpine as builder
ARG SCOPE
ENV NODE_ENV production
RUN apk add --update git
RUN npm install cipm --global --quiet
RUN mkdir -p /opt/target
WORKDIR /opt/src
COPY package*.json ./
RUN cipm --ignore-scripts
COPY . .
RUN npx lerna exec --scope $SCOPE mv nginx.conf /opt/target/
RUN npx lerna bootstrap --npm-client=cipm --scope $SCOPE --include-filtered-dependencies
RUN npx lerna run --scope $SCOPE build
RUN npx lerna exec --scope $SCOPE mv build /opt/target/

FROM nginx:alpine
EXPOSE 80
COPY --from=builder /opt/target/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /opt/target/build /usr/share/nginx/html
RUN chown nginx.nginx /usr/share/nginx/html/ -R
