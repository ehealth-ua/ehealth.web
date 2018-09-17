import React from "react";
import * as Emotion from "emotion-theming";

import defaultTheme from "./theme";
import Root from "./Root";

const ThemeProvider = ({ theme, ...props }) => (
  <Emotion.ThemeProvider theme={{ ...defaultTheme, ...theme }}>
    <Root {...props} />
  </Emotion.ThemeProvider>
);

export default ThemeProvider;
