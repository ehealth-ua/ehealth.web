import React from "react";
import gql from "graphql-tag";
import { DateFormat, Trans } from "@lingui/macro";
import { Flex } from "@rebass/emotion";
import { NegativeIcon, PositiveIcon } from "@ehealth/icons";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";

import Table from "../../../components/Table";
import Link from "../../../components/Link";
import FullName from "../../../components/FullName";
import DictionaryValue from "../../../components/DictionaryValue";

const EmployeesTable = ({ employees, locationParams, setLocationParams }) => (
  <Table
    data={employees}
    header={{
      databaseId: <Trans>ID</Trans>,
      partyFullName: <Trans>Name of employee</Trans>,
      taxId: <Trans>INN</Trans>,
      noTaxId: <Trans>No tax ID</Trans>,
      position: <Trans>Position</Trans>,
      startDate: <Trans>Start date</Trans>,
      employeeType: <Trans>Employee type</Trans>,
      legalEntityName: <Trans>Legal entity name</Trans>,
      divisionName: <Trans>Division name</Trans>,
      status: <Trans>Status</Trans>,
      isActive: <Trans>Is employee active</Trans>,
      details: <Trans>Details</Trans>
    }}
    renderRow={({
      id,
      party: { noTaxId, taxId, ...party } = {},
      position,
      employeeType,
      startDate,
      legalEntity,
      division,
      status,
      isActive,
      ...employeeData
    }) => ({
      ...employeeData,
      partyFullName: <FullName party={party} />,
      taxId,
      noTaxId: (
        <Flex justifyContent="center">
          {noTaxId ? <PositiveIcon /> : <NegativeIcon />}
        </Flex>
      ),
      position: <DictionaryValue name="POSITION" item={position} />,
      employeeType: (
        <DictionaryValue name="EMPLOYEE_TYPE" item={employeeType} />
      ),
      startDate: <DateFormat value={startDate} />,
      legalEntityName: legalEntity && legalEntity.name,
      divisionName: division && division.name,
      isActive: (
        <Flex justifyContent="center">
          {isActive ? <PositiveIcon /> : <NegativeIcon />}
        </Flex>
      ),
      status: <DictionaryValue name="EMPLOYEE_STATUS" item={status} />,
      details: (
        <Link to={`../${id}`} fontWeight="bold">
          <Trans>Show details</Trans>
        </Link>
      )
    })}
    sortableFields={[
      "partyFullName",
      "legalEntityName",
      "divisionName",
      "status",
      "employeeType"
    ]}
    sortingParams={parseSortingParams(locationParams.orderBy)}
    onSortingChange={sortingParams =>
      setLocationParams({
        ...locationParams,
        orderBy: stringifySortingParams(sortingParams)
      })
    }
    whiteSpaceNoWrap={["databaseId"]}
    tableName="employees/search"
  />
);

EmployeesTable.fragments = {
  entry: gql`
    fragment Employees on Employee {
      id
      databaseId
      position
      startDate
      endDate
      status
      employeeType
      party {
        id
        taxId
        ...FullName
      }
      additionalInfo {
        specialities {
          speciality
          specialityOfficio
        }
      }
      division {
        id
        databaseId
        name
      }
      legalEntity {
        id
        databaseId
        name
      }
    }
    ${FullName.fragments.entry}
  `
};

export default EmployeesTable;
