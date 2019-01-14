import React from "react";
import { Flex, Box, Text } from "@rebass/emotion";
import system from "@ehealth/system-components";
import { px } from "styled-system";

import { DefinitionList } from "@ehealth/components";

const DefinitionListView = ({
  title,
  labels,
  data,
  color,
  flexDirection,
  alignItems,
  marginBetween,
  labelWidth = 150
}) => (
  <DefinitionList
    labels={labels}
    data={data}
    renderItem={({ label, value }) => (
      <Item color={color} flexDirection={flexDirection} alignItems={alignItems}>
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
    extend: Flex,
    fontSize: 0,
    color: "#333",
    mb: 4
  },
  {
    flexWrap: "nowrap",
    flexDirection: "row"
  },
  `
    &:last-of-type {
      margin-bottom: 0;
    }
  `,
  "color",
  "fontSize",
  "space"
);
