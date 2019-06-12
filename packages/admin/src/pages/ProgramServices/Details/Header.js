//@flow
import React from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Flex, Box } from "@rebass/emotion";
import { PositiveIcon, NegativeIcon } from "@ehealth/icons";

import type { Scalars, ProgramService } from "@ehealth-ua/schema";

import Badge from "../../../components/Badge";
import Ability from "../../../components/Ability";
import DefinitionListView from "../../../components/DefinitionListView";

import UpdateProgramServicePopup from "./Mutations/Update";
import DeactivateProgramServicePopup from "./Mutations/Deactivate";

const Header = ({
  id,
  databaseId,
  isActive,
  requestAllowed
}: {
  id: Scalars.ID,
  databaseId: Scalars.UUID,
  isActive: ProgramService.isActive,
  requestAllowed: ProgramService.requestAllowed
}) => (
  <Flex justifyContent="space-between" alignItems="flex-end">
    <Box>
      <DefinitionListView
        labels={{
          databaseId: <Trans>ID</Trans>,
          isActive: <Trans>Status</Trans>,
          requestAllowed: <Trans>Is request allowed</Trans>
        }}
        data={{
          databaseId,
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
        color="#7F8FA4"
        labelWidth="120px"
        marginBetween="auto"
      />
    </Box>
    <Ability action="write" resource="program_service">
      <Flex justifyContent="flex-end" flexWrap="wrap">
        <Box mt={2}>
          <UpdateProgramServicePopup id={id} requestAllowed={requestAllowed} />
        </Box>
        <Box mt={2} ml={2}>
          <DeactivateProgramServicePopup id={id} />
        </Box>
      </Flex>
    </Ability>
  </Flex>
);

Header.fragments = {
  entry: gql`
    fragment Header on ProgramService {
      databaseId
      isActive
      requestAllowed
    }
  `
};

export default Header;
