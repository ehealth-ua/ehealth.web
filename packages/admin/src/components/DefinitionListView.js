import React from "react";
import { Flex, Box } from "rebass/emotion";
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
        <Box>{value}</Box>
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
    color: "#333"
  },
  `
    margin-bottom: 20px;
    &:last-of-type {
      margin-bottom: 0;
    }
  `
);

const Text = system({
  fontWeight: "bold"
});
