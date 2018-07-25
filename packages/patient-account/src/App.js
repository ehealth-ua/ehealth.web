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
  <Router>
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <DataProvider>
          <Preload>
            <Routes />
          </Preload>
        </DataProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </Router>
);

export default App;
