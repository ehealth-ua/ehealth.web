FROM node:alpine as builder
ARG SCOPE
ENV NODE_ENV production
RUN apk add --update git
RUN npm install cipm --global --quiet
RUN mkdir -p /opt/target/packages
WORKDIR /opt/src
COPY package*.json ./
RUN cipm --ignore-scripts
COPY . .
RUN npx lerna exec --scope $SCOPE -- 'ln -s ./packages/$(basename $PWD) /opt/target/main'
RUN npx lerna bootstrap --npm-client=cipm --scope $SCOPE --include-filtered-dependencies
RUN npx lerna exec --scope $SCOPE --include-filtered-dependencies -- 'mv $PWD /opt/target/packages/'
RUN mv node_modules /opt/target/

FROM node:alpine
EXPOSE 5000
WORKDIR /usr/src/app
COPY --from=builder /opt/target .
CMD ["npm", "--prefix", "main", "start"]
