import React from "react";
import * as Emotion from "emotion-theming";
import system from "system-components/emotion";

import defaultTheme from "./theme";

const ThemeProvider = ({ theme, ...props }) => (
  <Emotion.ThemeProvider theme={{ ...defaultTheme, ...theme }}>
    <Root {...props} />
  </Emotion.ThemeProvider>
);

export default ThemeProvider;

const Root = system(
  {
    fontFamily: "sans"
  },
  "fontFamily",
  {
    "& *": {
      boxSizing: "border-box"
    }
  },
  "space",
  "color"
);
