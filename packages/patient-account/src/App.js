import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@ehealth/components";

import "./globalStyles";
import theme from "./theme";
import ErrorBoundary from "./ErrorBoundary";
import DataProvider from "./DataProvider";
import Routes from "./Routes";
import Preload from "./Preload";

const App = () => (
  <ThemeProvider theme={theme}>
    <ErrorBoundary>
      <DataProvider>
        <Router>
          <Preload>
            <Routes />
          </Preload>
        </Router>
      </DataProvider>
    </ErrorBoundary>
  </ThemeProvider>
);

export default App;
