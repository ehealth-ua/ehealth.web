import React from "react";
import Helmet from "react-helmet";
import { Provider } from "react-redux";

import "./global.css";
import store from "./store";
import Routes from "./Routes";

const App = () => (
  <>
    <Helmet titleTemplate="Електронна система охорони здоров'я eHealth — %s" />
    <Provider store={store}>
      <Routes />
    </Provider>
  </>
);

export default App;
