import React from "react";
import { Query } from "react-apollo";
import { Box, Heading, Text } from "rebass/emotion";
import { loader } from "graphql.macro";
import { ITEMS_PER_PAGE } from "../constants/pagination";

const SearchLegalEntitiesQuery = loader(
  "../graphql/SearchLegalEntitiesQuery.graphql"
);

const Home = () => (
  <Query
    query={SearchLegalEntitiesQuery}
    variables={{
      first: ITEMS_PER_PAGE[0]
    }}
  >
    {({ loading, error, data }) => {
      if (loading || error) return null;
      return (
        <Box p={6}>
          <Heading as="h1" fontWeight="normal" mb={4}>
            Вітаємо в адміністративній системі Ehealth!
          </Heading>
          <Text>Оберіть пункт меню ліворуч, щоб почати роботу!</Text>
        </Box>
      );
    }}
  </Query>
);

export default Home;
