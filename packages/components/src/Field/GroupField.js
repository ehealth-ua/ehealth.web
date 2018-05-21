import React from "react";
import styled from "react-emotion/macro";

import LabelText from "./LabelText";

const GroupField = ({ label, children }) => (
  <Group>
    <LabelText>{label}</LabelText>
    {children}
  </Group>
);

export default GroupField;

const Group = styled.div`
  & + & {
    display: block;
  }
`;
