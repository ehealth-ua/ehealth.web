# Gatekeeper

Keeps client secret and exchanges authorization codes to authorization tokens. Implements [redirection endpoint](https://tools.ietf.org/html/rfc6749#section-3.1.2) in OAuth 2.0 Code Grant.

## Running locally

To start application locally, run `npm start` script.

## Release

To build Docker image for application, run `npm run image:build` script.

Application Docker image can be published to registry with `npm run image:push` script.

## Environment variables

See [ENVIRONMENT.md](ENVIRONMENT.md).
