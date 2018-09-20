import React from "react";
import { Flex, Box, Text } from "rebass/emotion";
import system from "system-components/emotion";

import { DefinitionList } from "@ehealth/components";

const DefinitionListView = ({ title, labels, data, color, labelWidth }) => (
  <DefinitionList
    labels={labels}
    data={data}
    renderItem={({ label, value }) => (
      <Item color={color}>
        <Box width={labelWidth ? labelWidth : "150px"}>
          <Text fontWeight={700}>{label}</Text>
        </Box>
        <Box
          width={
            labelWidth ? `calc(100% - ${labelWidth})` : "calc(100% - 150px)"
          }
        >
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
    mb: 4
  },
  `
    &:last-of-type {
      margin-bottom: 0;
    }
  `
);
