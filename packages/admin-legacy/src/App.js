import React from "react";
import Helmet from "react-helmet";
import { ThemeProvider } from "@ehealth/components";
import { Provider } from "react-redux";

import "./global.css";
import store from "./store";
import theme from "./theme";
import Routes from "./routes";

const App = () => (
  <>
    <Helmet titleTemplate="Панель управління eHealth — %s" />
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    </Provider>
  </>
);

export default App;
