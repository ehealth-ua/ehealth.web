import React from "react";
import Helmet from "react-helmet";
import { Provider } from "react-redux";
import { ThemeProvider } from "@ehealth/components";

import "./global.css";
import store from "./store";
import theme from "./theme";
import Routes from "./Routes";

const App = () => (
  <>
    <Helmet titleTemplate="Електронна система охорони здоров'я eHealth — %s" />
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    </Provider>
  </>
);

export default App;
