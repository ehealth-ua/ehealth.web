import React from "react";
import { Flex, Box, Text } from "rebass/emotion";
import { LocationParams } from "@ehealth/components";
import system from "system-components/emotion";
import Button from "../Button";

const ShowItems = ({ count = ["10", "20", "50"] }) => (
  <LocationParams>
    {({ locationParams, setLocationParams }) => {
      const { first, last } = locationParams;
      return (
        <Flex alignItems="center" justifyContent="center" mr="1">
          <Text fontSize="12" fontWeight="700" color="blueberrySoda">
            показати
          </Text>
          <Box ml="1">
            {count.map((item, key) => (
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
                  fontSize="12"
                  fontWeight="700"
                  color={
                    item === first || item === last || (!key && !last && !first)
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
