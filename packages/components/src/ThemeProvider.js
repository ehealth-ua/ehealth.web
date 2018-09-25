import React from "react";
import * as Emotion from "emotion-theming";

import defaultTheme from "./theme";

const ThemeProvider = ({ theme, ...props }) => (
  <Emotion.ThemeProvider theme={{ ...defaultTheme, ...theme }} {...props} />
);

export default ThemeProvider;
