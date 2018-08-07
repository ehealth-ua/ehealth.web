import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@ehealth/components";

import "./globalStyles";
import theme from "./theme";
import Routes from "./Routes";

const App = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <Routes />
    </Router>
  </ThemeProvider>
);

export default App;
