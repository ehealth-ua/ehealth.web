import { injectGlobal } from "react-emotion/macro";
import { colors } from "./theme";

injectGlobal`
  html {
    background-color: ${colors.gunPowder};
  }

  body {
    -webkit-font-smoothing: antialiased;
    font-family: "Montserrat", sans-serif;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  body *, body *::after, body *::before  {
      box-sizing: border-box
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
`;
