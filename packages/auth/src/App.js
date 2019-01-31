import React from "react";
import Helmet from "react-helmet";
import { Provider } from "react-redux";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ThemeProvider } from "@ehealth/components";

import "./global.css";
import store from "./store";
import theme from "./theme";
import Routes from "./Routes";
import env from "./env";

const App = () => (
  <>
    <Helmet titleTemplate="Електронна система охорони здоров'я eHealth — %s" />
    <GoogleReCaptchaProvider reCaptchaKey={env.REACT_APP_RECAPTCHA_KEY}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Routes />
        </ThemeProvider>
      </Provider>
    </GoogleReCaptchaProvider>
  </>
);

export default App;
