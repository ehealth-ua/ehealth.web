import React from "react";
import { Flex, Box, Text } from "rebass/emotion";
import system from "system-components/emotion";
import { px } from "styled-system";

import { DefinitionList } from "@ehealth/components";

const DefinitionListView = ({
  title,
  labels,
  data,
  color,
  flexDirection,
  marginBetween,
  labelWidth = 150
}) => (
  <DefinitionList
    labels={labels}
    data={data}
    renderItem={({ label, value }) => (
      <Item color={color} flexDirection={flexDirection}>
        <Box width={labelWidth}>
          <Text fontWeight={700}>{label}</Text>
        </Box>
        <Box width={`calc(100% - ${px(labelWidth)})`} my={marginBetween}>
          {value}
        </Box>
      </Item>
    )}
  />
);

export default DefinitionListView;

const Item = system(
  {
    is: Flex,
    flexWrap: "nowrap",
    fontSize: 0,
    color: "#333",
    mb: 4,
    flexDirection: "row"
  },
  `
    &:last-of-type {
      margin-bottom: 0;
    }
  `
);
