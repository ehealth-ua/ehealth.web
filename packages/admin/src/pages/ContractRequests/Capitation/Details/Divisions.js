//@flow

import React from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Box, Flex } from "@rebass/emotion";
import { formatWorkingHours } from "@ehealth/utils";
import { NegativeIcon, PositiveIcon } from "@ehealth/icons";
import Table from "../../../../components/Table";
import EmptyData from "../../../../components/EmptyData";
import AddressView from "../../../../components/AddressView";

import WEEK_DAYS from "../../../../helpers/weekDays";
import type { ContractRequest } from "@ehealth-ua/schema";

const Divisions = ({
  contractorDivisions
}: {
  contractorDivisions: ContractRequest.contractorDivisions
}) =>
  contractorDivisions && contractorDivisions.length > 0 ? (
    <Table
      data={contractorDivisions}
      header={{
        name: <Trans>Division name</Trans>,
        addresses: <Trans>Address</Trans>,
        mountainGroup: <Trans>Mountain region</Trans>,
        workingHours: <Trans>Work schedule</Trans>,
        phones: (
          <>
            <Trans>Phone</Trans>
            <br />
            <Trans>Email</Trans>
          </>
        )
      }}
      renderRow={({
        name,
        addresses,
        mountainGroup,
        workingHours,
        phones,
        email
      }) => ({
        name,
        mountainGroup: (
          <Flex justifyContent="center">
            {mountainGroup ? <PositiveIcon /> : <NegativeIcon />}
          </Flex>
        ),
        phones: (
          <>
            <Box>
              {phones
                .filter(a => a.type === "MOBILE")
                .map((item, key) => item.number)[0] || phones[0].number}
            </Box>
            <Box>{email}</Box>
          </>
        ),
        workingHours:
          workingHours &&
          formatWorkingHours(WEEK_DAYS, workingHours).map(({ day, hours }) => (
            <Box pb={2}>
              {day}: {hours.map(i => i.join("-")).join(", ")}
            </Box>
          )),
        addresses: addresses
          .filter(a => a.type === "RESIDENCE")
          .map((item, key) => <AddressView data={item} key={key} />)
      })}
      tableName="/capitation-contract-requests/divisions"
      hiddenFields="workingHours"
      hidePagination
    />
  ) : (
    <EmptyData />
  );

Divisions.fragments = {
  entry: gql`
    fragment Divisions on CapitationContractRequest {
      contractorDivisions {
        id
        name
        addresses {
          ...Addresses
        }
        phones {
          type
          number
        }
        email
        mountainGroup
        workingHours
      }
    }
    ${AddressView.fragments.entry}
  `
};

export default Divisions;
