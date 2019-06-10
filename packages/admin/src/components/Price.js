//@flow
import React from "react";
import { Trans } from "@lingui/macro";

const Price = ({ amount }: { amount: number }) =>
  amount && (
    <>
      {amount} <Trans>uah</Trans>
    </>
  );

export default Price;
