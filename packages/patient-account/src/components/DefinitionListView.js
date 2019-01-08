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
  labelWidth = 200
}) => (
  <DefinitionList
    labels={labels}
    data={data}
    renderItem={({ label, value }) => (
      <Item color={color}>
        <Box width={labelWidth}>
          <Text fontWeight={700}>{label}</Text>
        </Box>
        <Box width={`calc(100% - ${px(labelWidth)})`}>{value}</Box>
      </Item>
    )}
  />
);

export default DefinitionListView;

const Item = system(
  {
    extend: Flex,
    fontSize: 1,
    color: "#333",
    mb: 4
  },
  `
    flex-wrap: nowrap;
    &:last-of-type {
      margin-bottom: 0;
    }
  `,
  "space",
  "color",
  "fontSize"
);
