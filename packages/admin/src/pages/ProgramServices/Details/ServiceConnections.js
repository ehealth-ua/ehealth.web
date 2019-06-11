import React from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Box } from "@rebass/emotion";
import { PositiveIcon, NegativeIcon } from "@ehealth/icons";

import type { ProgramService } from "@ehealth-ua/schema";

import Badge from "../../../components/Badge";
import DefinitionListView from "../../../components/DefinitionListView";

const ServiceConnections = ({
  service,
  serviceGroup
}: {
  service?: ProgramService.service,
  serviceGroup?: ProgramService.serviceGroup
}) => {
  const { isActive, requestAllowed, ...details } =
    service || serviceGroup || {};
  return (
    <Box p={5}>
      <DefinitionListView
        labels={{
          databaseId: <Trans>ID</Trans>,
          name: <Trans>Name</Trans>,
          code: <Trans>Code</Trans>,
          category: <Trans>Category</Trans>,
          isActive: <Trans>Status</Trans>,
          requestAllowed: <Trans>Is request allowed</Trans>
        }}
        data={{
          ...details,
          isActive: (
            <Badge
              type="ACTIVE_STATUS_M"
              name={isActive}
              variant={!isActive}
              minWidth={100}
            />
          ),
          requestAllowed: requestAllowed ? <PositiveIcon /> : <NegativeIcon />
        }}
        labelWidth="120px"
        marginBetween="auto"
      />
    </Box>
  );
};

ServiceConnections.fragments = {
  entry: gql`
    fragment ServiceConnections on ProgramService {
      service {
        databaseId
        name
        code
        category
        isActive
        requestAllowed
      }
      serviceGroup {
        databaseId
        name
        code
        isActive
        requestAllowed
      }
    }
  `
};

export default ServiceConnections;
