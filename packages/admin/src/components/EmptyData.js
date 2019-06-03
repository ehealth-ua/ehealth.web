import React from "react";
import { Trans } from "@lingui/macro";
import { Box, Text } from "@rebass/emotion";
import system from "@ehealth/system-components";

const EmptyData = props => (
  <WrapperBoxHeight>
    <Text color="shiningKnight" fontSize={1} mx={6} my={2} {...props}>
      <Trans>No info</Trans>
    </Text>
  </WrapperBoxHeight>
);

const WrapperBoxHeight = system(
  {
    is: Box,
    height: 500
  },
  "height"
);

export default EmptyData;
