import React from "react";
import Helmet from "react-helmet";
import { ThemeProvider } from "emotion-theming";
import { Provider } from "react-redux";
import DigitalSignature from "@ehealth/react-iit-digital-signature";

import "./global.css";
import store from "./store";
import theme from "./theme";
import Routes from "./Routes";

const App = () => (
  <>
    <Helmet titleTemplate="Електронна система охорони здоров'я eHealth — %s" />
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <DigitalSignature>
          <Routes />
        </DigitalSignature>
      </ThemeProvider>
    </Provider>
  </>
);

export default App;
