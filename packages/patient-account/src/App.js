import React from "react";
import { ThemeProvider } from "@ehealth/components";

import "./globalStyles";
import * as theme from "./theme";
import ErrorBoundary from "./ErrorBoundary";
import DataProvider from "./DataProvider";
import Routes from "./Routes";
import Preload from "./Preload";

const App = () => (
  <ThemeProvider theme={theme}>
    <ErrorBoundary>
      <DataProvider>
        <Preload>
          <Routes />
        </Preload>
      </DataProvider>
    </ErrorBoundary>
  </ThemeProvider>
);

export default App;
