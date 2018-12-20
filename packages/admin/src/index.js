import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";

import { version } from "../package.json";
import env from "./env";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

if (env.NODE_ENV === "production") {
  Sentry.init({
    dsn: env.REACT_APP_SENTRY_DSN,
    release: version,
    environment: env.REACT_APP_ENVIRONMENT
  });
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
