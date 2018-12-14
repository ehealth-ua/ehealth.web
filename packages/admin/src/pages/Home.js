import React from "react";
import { Box, Heading, Text } from "rebass/emotion";
import { Trans } from "@lingui/macro";

const Home = () => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={4}>
      <Trans>Вітаємо в адміністративній системі Ehealth!</Trans>
    </Heading>
    <Text>
      <Trans>Оберіть пункт меню ліворуч, щоб почати роботу!</Trans>
    </Text>
  </Box>
);

export default Home;
