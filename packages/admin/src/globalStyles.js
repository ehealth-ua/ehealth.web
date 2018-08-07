import { injectGlobal } from "react-emotion/macro";

injectGlobal`
  html {
    background-color: #fff;
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
`;
