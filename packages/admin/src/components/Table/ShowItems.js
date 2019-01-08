import React from "react";
import { Flex, Box, Text } from "@rebass/emotion";
import { LocationParams } from "@ehealth/components";
import Button from "../Button";

const ShowItems = ({ list = [] }) => (
  <LocationParams>
    {({ locationParams, setLocationParams }) => {
      const { first, last } = locationParams;
      return (
        <Flex alignItems="center" justifyContent="center" mr="1">
          <Text fontSize="0" fontWeight="700" color="blueberrySoda">
            показати
          </Text>
          <Box ml="1">
            {list.map((item, key) => (
              <Button
                key={key}
                variant="none"
                border="none"
                px="1"
                onClick={() => {
                  setLocationParams({
                    ...locationParams,
                    first: !last ? item : null,
                    last: last ? item : null
                  });
                }}
              >
                <Text
                  fontSize="0"
                  fontWeight="700"
                  color={
                    item === parseInt(first) ||
                    item === parseInt(last) ||
                    (!key && !last && !first)
                      ? "silverCity"
                      : "blueberrySoda"
                  }
                >
                  {item}
                </Text>
              </Button>
            ))}
          </Box>
        </Flex>
      );
    }}
  </LocationParams>
);

export default ShowItems;
