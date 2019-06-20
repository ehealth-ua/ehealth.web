import React from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Box } from "@rebass/emotion";
import { PositiveIcon, NegativeIcon } from "@ehealth/icons";

import type { ProgramService } from "@ehealth-ua/schema";

import Link from "../../../components/Link";
import Badge from "../../../components/Badge";
import DictionaryValue from "../../../components/DictionaryValue";
import DefinitionListView from "../../../components/DefinitionListView";

const ServiceConnections = ({
  service,
  serviceGroup
}: {
  service?: ProgramService.service,
  serviceGroup?: ProgramService.serviceGroup
}) => {
  const { id, databaseId, isActive, requestAllowed, category, ...details } =
    service || serviceGroup || {};

  const connectionUrl = service ? "services" : "service-groups";

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
          databaseId: databaseId && (
            <Link to={`/${connectionUrl}/${id}`}>{databaseId}</Link>
          ),
          category: category && (
            <DictionaryValue name="SERVICE_CATEGORY" item={category} />
          ),
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
        id
        databaseId
        name
        code
        category
        isActive
        requestAllowed
      }
      serviceGroup {
        id
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
