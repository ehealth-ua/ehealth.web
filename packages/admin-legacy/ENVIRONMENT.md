# Environment Variables

Application can be configured using these environment variables:

| Name                           | Default value | Description                                                                                                                                                                             |
| :----------------------------- | :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REACT_APP_FEATURES`           | not set       | Comma-separated-list of enabled application features. E.g.: `legacy,person,declaration`.                                                                                                |
| `REACT_APP_CLIENT_ID`          | not set       | OAuth client identifier. Issued by authorization server.                                                                                                                                |
| `REACT_APP_OAUTH_URL`          | not set       | OAuth authorization server URL. Users will be leaded there on authorization requests.                                                                                                   |
| `REACT_APP_OAUTH_REDIRECT_URI` | not set       | OAuth Redirection Endpoint URI. Usually points to the [Gatekeeper](../gatekeeper#readme) service instance configured with client secret corresponding to application client identifier. |
| `REACT_APP_ADMIN_URL`          | not set       | eHealth Admin application URL. All links to admin panel pages will use it.                                                                                                              |
| `REACT_APP_SIGNER_URL`         | not set       | Digital Signature Signer service URL.                                                                                                                                                   |
| `REACT_APP_STAMP_URL`          | not set       | Digital Stamp Signer service URL.                                                                                                                                                       |

Since this application was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), all environment variables supported by it are also applicable. See more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/advanced-configuration).

## Feature Flags

For feature flags we use [flag](https://github.com/garbles/flag) package
If you want to add new flag, you must add it to the `REACT_APP_FEATURES`, and then you need to restart your application. After this, it will be available in the `flags` object, which passed into `FlagsProvider`.
