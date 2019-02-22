import React from "react";
import { Trans } from "@lingui/react";

const ErrorTranslation = ({ error }) => {
  const [id, values] =
    typeof error === "string" ? [error] : [error.message, error.options];
  return <Trans id={id} values={values} />;
};

export default ErrorTranslation;
