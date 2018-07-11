import React from "react";
import { Provider } from "rebass/emotion";

import defaultTheme from "./theme";

const ThemeProvider = ({ theme, ...props }) => (
  <Provider {...props} theme={{ ...defaultTheme, ...theme }} />
);

export default ThemeProvider;
