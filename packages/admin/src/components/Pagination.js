import React from "react";
import { Flex, Box, Heading, Text } from "rebass/emotion";
import { LocationParams } from "@ehealth/components";
import { TriangleLeftIcon, TriangleRightIcon } from "@ehealth/icons";
import Button from "./Button";
import system from "system-components/emotion";
import { ITEMS_PER_PAGE } from "../constants/pagination";

const Pagination = ({
  endCursor,
  hasNextPage,
  hasPreviousPage,
  startCursor,
  itemsCountDefault = ITEMS_PER_PAGE[0]
}) => (
  <LocationParams>
    {({ locationParams, setLocationParams }) => {
      const { first, last } = locationParams;
      return (
        <Flex alignItems="center" justifyContent="center" m="2">
          {hasPreviousPage && (
            <Box mr="1">
              <Button
                variant="none"
                border="1px solid #e6eaee"
                onClick={() => {
                  setLocationParams({
                    ...locationParams,
                    before: startCursor,
                    last: last || itemsCountDefault,
                    after: undefined,
                    first: undefined
                  });
                }}
              >
                <Wrapper>
                  <TriangleLeftIcon />
                  <Text ml="1" color="darkAndStormy">
                    Назад
                  </Text>
                </Wrapper>
              </Button>
            </Box>
          )}
          {hasNextPage && (
            <Button
              variant="none"
              border="1px solid #e6eaee"
              onClick={() => {
                setLocationParams({
                  ...locationParams,
                  after: endCursor,
                  first: first || itemsCountDefault,
                  before: undefined,
                  last: undefined
                });
              }}
            >
              <Wrapper>
                <Text mr="1" color="darkAndStormy">
                  Вперед
                </Text>
                <TriangleRightIcon />
              </Wrapper>
            </Button>
          )}
        </Flex>
      );
    }}
  </LocationParams>
);

const Wrapper = system({
  is: Flex,
  alignItems: "center",
  justifyContent: "center",
  width: "70",
  lineHeight: "1",
  color: "silverCity"
});

export default Pagination;
