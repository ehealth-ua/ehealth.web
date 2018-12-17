import React from "react";
import { Box, Heading, Text } from "rebass/emotion";
import { Trans } from "@lingui/macro";

const Home = () => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={4}>
      <Trans>Congratulations on the administrative system Ehealth!</Trans>
    </Heading>
    <Text>
      <Trans>Select the menu item on the left to get started!</Trans>
    </Text>
  </Box>
);

export default Home;
