# Environment Variables

Application can be configured using these environment variables:

| Name               | Default value   | Description                                                                 |
| :----------------- | :-------------- | :-------------------------------------------------------------------------- |
| `NODE_ENV`         | `development`   | Mode in which application is running. Can be `development` or `production`. |
| `PORT`             | `4000`          | Port for application to listen on.                                          |
| `API_URL`          | not set         | eHealth REST API base URL. All API requests will be sent there.             |
| `CLIENT_ID`        | not set         | OAuth client identifier. Issued by authorization server.                    |
| `CLIENT_SECRET`    | not set         | OAuth client secret. Issued by authorization server.                        |
| `COOKIE_DOMAIN`    | not set         | Host to which the cookie will be sent from client.                          |
| `AUTH_COOKIE_NAME` | `authorization` | Name of the cookie to store authorization token.                            |
| `META_COOKIE_NAME` | `meta`          | Name of the cookie to store authorization metadata.                         |
| `REDIRECT_URL`     | `/`             | URL where redirect to after successful access token obtaining.              |
