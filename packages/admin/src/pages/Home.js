import React from "react";
import { Box, Heading, Text } from "rebass/emotion";

const Home = () => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={4}>
      Вітаємо в адміністративній системі Ehealth!
    </Heading>
    <Text>Оберіть пункт меню ліворуч, щоб почати роботу!</Text>
  </Box>
);

export default Home;
