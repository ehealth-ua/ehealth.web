//@flow
import * as React from "react";
import gql from "graphql-tag";
import { Link } from "@reach/router";
import { Trans } from "@lingui/macro";
import printIframe from "print-iframe";
import { Switch } from "@ehealth/components";
import { PrinterIcon } from "@ehealth/icons";
import system from "@ehealth/system-components";
import { Box, Flex, Text } from "@rebass/emotion";
import Badge from "../../../../components/Badge";
import Button from "../../../../components/Button";
import FullName from "../../../../components/FullName";
import LinkComponent from "../../../../components/Link";
import DefinitionListView from "../../../../components/DefinitionListView";

import ModalAssigneeSearch from "../../../../components/ModalAssigneeSearch";
import type { Scalars, ContractRequest, Party } from "@ehealth-ua/schema";

import { CapitationContractRequestQuery } from "./";

const Header = ({
  id,
  databaseId,
  previousRequest,
  assignee,
  status,
  printoutContent
}: {
  id: Scalars.ID,
  databaseId: Scalars.UUID,
  previousRequest: ContractRequest,
  assignee: {
    id: Scalars.ID,
    party: Party
  },
  status: ContractRequest.status,
  printoutContent: ContractRequest.printoutContent
}) => (
  <Flex justifyContent="space-between">
    <Box>
      <DefinitionListView
        labels={{
          id: <Trans>Contract request ID</Trans>,
          previousRequestId: <Trans>Previous request ID</Trans>,
          status: <Trans>Status</Trans>,
          assignee: <Trans>Performer</Trans>
        }}
        data={{
          id: databaseId,
          previousRequestId: previousRequest && (
            <LinkComponent
              to={`/contract-requests/capitation/${previousRequest.id}`}
            >
              {previousRequest.databaseId}
            </LinkComponent>
          ),
          status: (
            <Badge name={status} type="CONTRACT_REQUEST" minWidth={100} />
          ),
          assignee: (
            <Switch
              value={status}
              NEW={
                <ModalAssigneeSearch
                  submitted={assignee && <FullName party={assignee.party} />}
                  id={id}
                  query={CapitationContractRequestQuery}
                />
              }
              IN_PROCESS={
                <ModalAssigneeSearch
                  submitted={assignee && <FullName party={assignee.party} />}
                  id={id}
                  query={CapitationContractRequestQuery}
                />
              }
              default={assignee && <FullName party={assignee.party} />}
            />
          )
        }}
        color="#7F8FA4"
        labelWidth="100px"
      />
    </Box>
    <Switch
      value={status}
      IN_PROCESS={
        <Flex alignItems="flex-end">
          <Flex>
            <Box mr={2}>
              <Link to="decline">
                <Button variant="red">
                  <Trans>Reject</Trans>
                </Button>
              </Link>
            </Box>
            <Link to="update">
              <Button variant="green">
                <Trans>Approve</Trans>
              </Button>
            </Link>
          </Flex>
        </Flex>
      }
      PENDING_NHS_SIGN={
        <Flex
          flexDirection="column"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <PrintButton printoutContent={printoutContent} />
          <Link to="./print-out-content">
            <Button variant="green">
              <Trans>Sign</Trans>
            </Button>
          </Link>
        </Flex>
      }
      NHS_SIGNED={<PrintButton printoutContent={printoutContent} />}
      SIGNED={<PrintButton printoutContent={printoutContent} />}
    />
  </Flex>
);

const PrintButton = ({ printoutContent }) => (
  <Wrapper color="shiningKnight" onClick={() => printIframe(printoutContent)}>
    <Text color="rockmanBlue" fontWeight="bold" mr={1} fontSize="0">
      <Trans>Show printout form</Trans>
    </Text>
    <PrinterIcon />
  </Wrapper>
);

const Wrapper = system(
  {
    extend: Flex
  },
  { cursor: "pointer" },
  "color"
);

Header.fragments = {
  entry: gql`
    fragment Header on CapitationContractRequest {
      id
      databaseId
      previousRequest {
        id
        databaseId
      }
      assignee {
        id
        party {
          id
          ...FullName
        }
      }
      status
      printoutContent
    }
    ${FullName.fragments.entry}
  `
};

export default Header;
