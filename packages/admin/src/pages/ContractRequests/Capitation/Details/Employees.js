//@flow

import React from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import Table from "../../../../components/Table";
import EmptyData from "../../../../components/EmptyData";
import FullName from "../../../../components/FullName";
import DictionaryValue from "../../../../components/DictionaryValue";
import type { ContractRequest } from "@ehealth-ua/schema";

const Employees = ({
  contractorEmployeeDivisions
}: {
  contractorEmployeeDivisions: ContractRequest.contractorEmployeeDivisions
}) =>
  contractorEmployeeDivisions && contractorEmployeeDivisions.length > 0 ? (
    <Table
      data={contractorEmployeeDivisions}
      header={{
        databaseId: <Trans>ID</Trans>,
        divisionName: <Trans>Division name</Trans>,
        employeeName: <Trans>Name of employee</Trans>,
        speciality: <Trans>Specialty</Trans>,
        staffUnits: <Trans>Permanent unit</Trans>,
        declarationLimit: <Trans>Declarations limit</Trans>
      }}
      renderRow={({
        employee: {
          databaseId,
          party,
          additionalInfo: { specialities }
        },
        division: { name: divisionName },
        ...contractorEmployeeDivisions
      }) => ({
        databaseId,
        divisionName,
        employeeName: <FullName party={party} />,
        speciality: (
          <DictionaryValue
            name="SPECIALITY_TYPE"
            item={
              specialities.find(item => item.specialityOfficio && item)
                .speciality
            }
          />
        ),
        ...contractorEmployeeDivisions
      })}
      tableName="/capitation-contract-requests/employees"
      whiteSpaceNoWrap={["databaseId"]}
    />
  ) : (
    <EmptyData />
  );

Employees.fragments = {
  entry: gql`
    fragment Employees on CapitationContractRequest {
      contractorEmployeeDivisions {
        employee {
          id
          databaseId
          party {
            id
            ...FullName
          }
          additionalInfo {
            specialities {
              speciality
              specialityOfficio
            }
          }
        }
        staffUnits
        declarationLimit
        division {
          id
          name
        }
      }
    }
    ${FullName.fragments.entry}
  `
};

export default Employees;
