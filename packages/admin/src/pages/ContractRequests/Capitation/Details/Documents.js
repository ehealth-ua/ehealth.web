//@flow

import React from "react";
import gql from "graphql-tag";
import { Box, Text } from "@rebass/emotion";
import system from "@ehealth/system-components";
import { DefaultImageIcon } from "@ehealth/icons";
import EmptyData from "../../../../components/EmptyData";

import DictionaryValue from "../../../../components/DictionaryValue";
import type { ContractRequest } from "@ehealth-ua/schema";

const Documents = ({
  attachedDocuments
}: {
  attachedDocuments: ContractRequest.attachedDocuments
}) =>
  attachedDocuments ? (
    attachedDocuments.map(({ url, type }) => (
      <Box m="2">
        <SaveLink href={url} target="_blank">
          <Box m={1} color="shiningKnight">
            <DefaultImageIcon />
          </Box>
          <Text color="rockmanBlue" lineHeight="1">
            <DictionaryValue name="CONTRACT_DOCUMENT" item={type} />
          </Text>
        </SaveLink>
      </Box>
    ))
  ) : (
    <EmptyData />
  );

const SaveLink = system(
  {
    is: "a"
  },
  {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    lineHeight: 0,
    textDecoration: "none",
    fontSize: 14
  }
);

Documents.fragments = {
  entry: gql`
    fragment Documents on CapitationContractRequest {
      attachedDocuments {
        type
        url
      }
    }
  `
};

export default Documents;
