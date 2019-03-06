# eHealth Administration Panel (Legacy)

Legacy eHealth administration panel application.

## Development

To start the application in development mode standalone, run `npm start` script.

To start the application and all its dependencies in development mode, execute from the root of the project:

```sh
npm start -- --scope @ehealth/{admin-legacy,admin,auth,gatekeeper,iit-proxy,mock-server,polyfill}
```

You can exclude some dependencies from scope if there is no need to use them.

### Running tests

To run all application unit tests, execute from the root of the project:

```sh
npm run test:unit -- packages/admin-legacy/
```

## Release

To make production build, run `npm run build` script.

To build Docker image for application, run `npm run image:build` script.

Application Docker image can be published to registry with `npm run image:push` script.

## Environment variables

See [ENVIRONMENT.md](ENVIRONMENT.md).
