# Environment Variables

Application can be configured using these environment variables:

| Name                                          | Default value | Description                                                                                                                                 |
| :-------------------------------------------- | :------------ | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `REACT_APP_API_URL`                           | not set       | eHealth REST API base URL. All API requests will be sent there.                                                                             |
| `REACT_APP_CLIENT_ID`                         | not set       | OAuth client identifier. Issued by authorization server.                                                                                    |
| `REACT_APP_AUTH_URL`                          | not set       | Authorization service base URL.                                                                                                             |
| `REACT_APP_PROXY_URL`                         | not set       | [Proxy](../iit-proxy#readme) service URL.                                                                                                   |
| `REACT_APP_ALLOWED_SIGN_ORIGINS`              | not set       | Comma-separated list of origins allowed to use Digital Signature/Stamp Signer services.                                                     |
| `REACT_APP_DIGITAL_SIGNATURE_ENABLED`         | not set       | When set to `true` Digital Signature/Stamp Signer services will actually sign data, otherwise, data will be base64-encoded without signing. |
| `REACT_APP_SIGN_UP_ENABLED`                   | not set       | When set to `true` manual user registration functionality will be enabled.                                                                  |
| `REACT_APP_DIGITAL_SIGNATURE_SIGN_IN_ENABLED` | not set       | When set to `true` sign in using digital signature key will be enabled.                                                                     |
| `REACT_APP_PATIENT_ACCOUNT_CLIENT_ID`         | not set       | OAuth client identifier for [Patient Account](../patient-account#readme) application.                                                       |
| `REACT_APP_PATIENT_ACCOUNT_REDIRECT_URI`      | not set       | OAuth redirection endpoint URI for [Patient Account](../patient-account#readme) application.                                                |
| `REACT_APP_RECAPTCHA_KEY`                     | not set       | reCAPTCHA site key.                                                                                                                         |

Since this application was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), all environment variables supported by it are also applicable. See more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/advanced-configuration).
