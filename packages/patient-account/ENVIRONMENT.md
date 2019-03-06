# Environment Variables

Application can be configured using these environment variables:

| Name                           | Default value | Description                                                                                                                                                                             |
| :----------------------------- | :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REACT_APP_API_URL`            | not set       | eHealth REST API base URL. All API requests will be sent there.                                                                                                                         |
| `REACT_APP_CLIENT_ID`          | not set       | OAuth client identifier. Issued by authorization server.                                                                                                                                |
| `REACT_APP_OAUTH_URL`          | not set       | OAuth authorization server URL. Users will be leaded there on authorization requests.                                                                                                   |
| `REACT_APP_OAUTH_REDIRECT_URI` | not set       | OAuth redirection endpoint URI. Usually points to the [Gatekeeper](../gatekeeper#readme) service instance configured with client secret corresponding to application client identifier. |
| `REACT_APP_UPDATE_FACTOR_URL`  | not set       | Update authentication factor page URL.                                                                                                                                                  |

Since this application was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), all environment variables supported by it are also applicable. See more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/advanced-configuration).
