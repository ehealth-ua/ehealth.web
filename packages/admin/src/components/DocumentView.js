import * as React from "react";
import { DateFormat } from "@lingui/macro";
import { Box } from "@rebass/emotion";

const DocumentView = ({
  data: { number, issuedAt, issuedBy, expirationDate }
}) => (
  <Box fontSize={0}>
    {number}
    {issuedBy && `, виданий ${issuedBy}`}
    {issuedAt && (
      <>
        , від <DateFormat>{issuedAt}</DateFormat>
      </>
    )}
    {expirationDate && (
      <>
        , дійсний до <DateFormat>{expirationDate}</DateFormat>
      </>
    )}
  </Box>
);

export default DocumentView;
