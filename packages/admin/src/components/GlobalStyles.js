import React from "react";
import { Global, css } from "@emotion/core";
import { colors, fonts } from "../theme";

const GlobalStyles = () => (
  <Global
    styles={css`
      html {
        background-color: ${colors.gunPowder};
      }

      body {
        -webkit-font-smoothing: antialiased;
        font-family: ${fonts.sans};
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        & *,
        & *::after,
        & *::before {
          box-sizing: border-box;
        }
      }

      ul,
      ol {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

      input,
      textarea,
      button {
        appearance: none;
        background: none;
        border: none;
        border-radius: 0;
        color: inherit;
        font: inherit;
      }

      input,
      textarea,
      button {
        outline: none;
      }

      summary::-webkit-details-marker {
        display: none;
      }
    `}
  />
);

export default GlobalStyles;
