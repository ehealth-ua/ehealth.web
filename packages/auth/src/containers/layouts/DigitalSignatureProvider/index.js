import React from "react";
import DigitalSignature from "@ehealth/react-iit-digital-signature";

import { REACT_APP_PROXY_URL } from "../../../env";

const DigitalSignatureProvider = ({ children }) => (
  <DigitalSignature
    sourceUrl="/iit-digital-signature.min.js"
    proxy={REACT_APP_PROXY_URL}
  >
    {children}
  </DigitalSignature>
);

export default DigitalSignatureProvider;
