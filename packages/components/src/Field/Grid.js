import React from "react";
import styled from "react-emotion/macro";
import { prop, ifProp, withProp } from "styled-tools";
import { Flex, Box } from "rebass/emotion";

export const Row = styled(Flex)`
  margin-bottom: ${prop("theme.form.fieldVerticalDistance", 20)}px;

  &:last-child {
    margin-bottom: 0;
  }
`;

Row.defaultProps = {
  mx: -2
};

export const Col = props => <Box px={2} {...props} />;
