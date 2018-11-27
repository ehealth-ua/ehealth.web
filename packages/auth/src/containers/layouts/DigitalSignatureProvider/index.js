import React from "react";
import DigitalSignature from "@ehealth/react-iit-digital-signature";

import env from "../../../env";

const DigitalSignatureProvider = ({ children }) => (
  <DigitalSignature
    sourceUrl="/iit-digital-signature.min.js"
    proxy={env.REACT_APP_PROXY_URL}
  >
    {children}
  </DigitalSignature>
);

export default DigitalSignatureProvider;
