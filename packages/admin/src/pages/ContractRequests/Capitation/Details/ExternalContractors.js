//@flow

import React from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { BooleanValue } from "react-values";
import { Flex, Text } from "@rebass/emotion";
import system from "@ehealth/system-components";
import { filterTableColumn as filterTableDefaultColumn } from "@ehealth/utils";
import Table, {
  TableBodyComponent,
  TableCell,
  TableRow
} from "../../../../components/Table";
import EmptyData from "../../../../components/EmptyData";
import DictionaryValue from "../../../../components/DictionaryValue";
import type { ContractRequest } from "@ehealth-ua/schema";

const ExternalContractors = ({
  externalContractors
}: {
  externalContractors: ContractRequest.externalContractors
}) =>
  externalContractors && externalContractors.length > 0 ? (
    <>
      <Text px={6} pt={2} fontSize={1}>
        <Trans>To see the services, click on "Show division"</Trans>
      </Text>
      <ExternalContractorsTable data={externalContractors} />
    </>
  ) : (
    <EmptyData />
  );

const ExternalContractorsTable = ({ data }) => (
  <Table
    data={data}
    header={{
      name: <Trans>Legal entity</Trans>,
      divisions: <Trans>Division and Services</Trans>,
      number: <Trans>Contract Number</Trans>,
      issuedAt: <Trans>Contract start date</Trans>,
      expiresAt: <Trans>Contract end date</Trans>
    }}
    tableName="/capitation-contract-requests/external-contractors"
    tableBody={({
      columns,
      data,
      rowKeyExtractor,
      columnKeyExtractor,
      filterTableColumn = filterTableDefaultColumn,
      filterRow
    }) => {
      const renderRow = (
        {
          legalEntity: { name },
          contract: { number, issuedAt, expiresAt },
          divisions
        },
        onClick
      ) => ({
        name,
        number,
        issuedAt,
        expiresAt,
        divisions: (
          <Wrapper onClick={onClick}>
            <Text color="rockmanBlue" fontWeight="bold" mr={1} fontSize={0}>
              <Trans>Show division</Trans>({divisions.length})
            </Text>
          </Wrapper>
        )
      });

      return (
        <TableBodyComponent>
          {data.map((item, index) => (
            <BooleanValue>
              {({ value: opened, toggle }) => {
                const row = renderRow(item, toggle);
                return (
                  <>
                    <TableRow key={rowKeyExtractor(item, index)}>
                      {columns
                        .filter(bodyName =>
                          filterTableColumn(filterRow, bodyName)
                        )
                        .map((name, index) => (
                          <TableCell key={columnKeyExtractor(name, index)}>
                            {row[name]}
                          </TableCell>
                        ))}
                    </TableRow>
                    {opened && (
                      <TableRow
                        key={`row_${rowKeyExtractor(item, index)}`}
                        fullSize
                      >
                        <TableCell
                          key={`cell_${rowKeyExtractor(item, index)}`}
                          colSpan={
                            columns.filter(bodyName =>
                              filterTableColumn(filterRow, bodyName)
                            ).length
                          }
                          fullSize
                        >
                          <Table
                            data={item.divisions}
                            header={{
                              name: "",
                              medicalService: ""
                            }}
                            renderRow={({
                              division: { name },
                              medicalService
                            }) => ({
                              name,
                              medicalService: (
                                <DictionaryValue
                                  name="MEDICAL_SERVICE"
                                  item={medicalService}
                                />
                              )
                            })}
                            tableName="/capitation-contract-requests/ExternalContractorsTable"
                            headless
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              }}
            </BooleanValue>
          ))}
        </TableBodyComponent>
      );
    }}
  />
);

const Wrapper = system(
  {
    extend: Flex
  },
  { cursor: "pointer" },
  "color"
);

ExternalContractors.fragments = {
  entry: gql`
    fragment ExternalContractors on CapitationContractRequest {
      externalContractors {
        legalEntity {
          id
          name
        }
        contract {
          number
          issuedAt
          expiresAt
        }
        divisions {
          division {
            id
            name
          }
          medicalService
        }
      }
    }
  `
};

export default ExternalContractors;
