import React from "react";

import { ThemeProvider } from "@ehealth/components";

import GlobalStyles from "./components/GlobalStyles";
import * as theme from "./theme";
import ErrorBoundary from "./ErrorBoundary";
import DataProvider from "./DataProvider";
import Routes from "./Routes";
import Preload from "./Preload";

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
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
