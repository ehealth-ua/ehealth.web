import { injectGlobal } from "react-emotion/macro";
import { colors } from "./theme";

injectGlobal`
  @font-face {
    font-family: "GothamPro";
    font-style: normal;
    font-weight: 400;
    src: url("/fonts/GothamPro/GothamPro.eot?") format("eot"),
      url("/fonts/GothamPro/GothamPro.otf") format("opentype"),
      url("/fonts/GothamPro/GothamPro.woff") format("woff"),
      url("/fonts/GothamPro/GothamPro.ttf") format("truetype"),
      url("/fonts/GothamPro/GothamPro.svg#GothamPro") format("svg");
  }

  @font-face {
    font-family: "GothamPro";
    font-weight: 500;
    src: url("/fonts/GothamPro-Medium/GothamPro-Medium.eot?") format("eot"),
      url("/fonts/GothamPro-Medium/GothamPro-Medium.otf") format("opentype"),
      url("/fonts/GothamPro-Medium/GothamPro-Medium.woff") format("woff"),
      url("/fonts/GothamPro-Medium/GothamPro-Medium.ttf") format("truetype"),
      url("/fonts/GothamPro-Medium/GothamPro-Medium.svg#GothamPro-Medium")
        format("svg");
  }

  @font-face {
    font-family: "GothamPro";
    font-weight: 700;
    src: url("/fonts/GothamPro-Bold/GothamPro-Bold.eot?") format("eot"),
      url("/fonts/GothamPro-Bold/GothamPro-Bold.otf") format("opentype"),
      url("/fonts/GothamPro-Bold/GothamPro-Bold.woff") format("woff"),
      url("/fonts/GothamPro-Bold/GothamPro-Bold.ttf") format("truetype"),
      url("/fonts/GothamPro-Bold/GothamPro-Bold.svg#GothamPro-Bold") format("svg");
  }

  @font-face {
    font-family: "GothamPro";
    font-weight: 300;
    src: url("/fonts/GothamPro-Light/GothamPro-Light.eot?") format("eot"),
      url("/fonts/GothamPro-Light/GothamPro-Light.otf") format("opentype"),
      url("/fonts/GothamPro-Light/GothamPro-Light.woff") format("woff"),
      url("/fonts/GothamPro-Light/GothamPro-Light.ttf") format("truetype"),
      url("/fonts/GothamPro-Light/GothamPro-Light.svg#GothamPro-Light")
        format("svg");
  }

  html {
    background-color: ${colors.gunPowder};
  }

  body {
    -webkit-font-smoothing: antialiased;
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
