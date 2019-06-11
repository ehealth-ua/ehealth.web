import React from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Heading, Box } from "@rebass/emotion";

import type { ProgramService } from "@ehealth-ua/schema";

import Line from "../../../components/Line";
import Price from "../../../components/Price";
import Badge from "../../../components/Badge";
import DefinitionListView from "../../../components/DefinitionListView";

const GeneralInfo = ({
  consumerPrice,
  description,
  medicalProgram
}: {
  consumerPrice: ProgramService.consumerPrice,
  description: ProgramService.description,
  medicalProgram: ProgramService.medicalProgram
}) => {
  const { databaseId, name, isActive } = medicalProgram || {};
  return (
    <Box p={5}>
      <DefinitionListView
        labels={{
          consumerPrice: <Trans>Price</Trans>,
          description: <Trans>Description</Trans>
        }}
        data={{
          consumerPrice: <Price amount={consumerPrice} />,
          description
        }}
        labelWidth="120px"
      />
      {databaseId && (
        <>
          <Line />
          <Heading fontSize="1" fontWeight="normal" mb={5}>
            <Trans>Medical program</Trans>
          </Heading>
          <DefinitionListView
            labels={{
              databaseId: <Trans>ID</Trans>,
              name: <Trans>Name</Trans>,
              isActive: <Trans>Status</Trans>
            }}
            data={{
              databaseId,
              name,
              isActive: (
                <Badge
                  type="ACTIVE_STATUS_M"
                  name={isActive}
                  variant={!isActive}
                  minWidth={100}
                />
              )
            }}
            labelWidth="120px"
          />
        </>
      )}
    </Box>
  );
};

GeneralInfo.fragments = {
  entry: gql`
    fragment GeneralInfo on ProgramService {
      description
      consumerPrice
      medicalProgram {
        databaseId
        name
        isActive
      }
    }
  `
};

export default GeneralInfo;
