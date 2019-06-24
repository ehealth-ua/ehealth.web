//@flow
import * as React from "react";
import gql from "graphql-tag";
import { DateFormat, Trans } from "@lingui/macro";
import {
  parseSortingParams,
  stringifySortingParams,
  getFullName,
  formatDate
} from "@ehealth/utils";

import type { Person } from "@ehealth-ua/schema";
import type {
  URLSearchParams,
  SetLocationParamsProp
} from "@ehealth/components";

import Link from "../../../components/Link";
import Badge from "../../../components/Badge";
import Table from "../../../components/Table";
import AuthMethodsList from "../../../components/AuthMethodsList";

const PersonsTable = ({
  persons,
  locationParams,
  setLocationParams,
  tableName = "persons/search"
}: {
  persons: Array<Person>,
  locationParams: URLSearchParams,
  setLocationParams: SetLocationParamsProp,
  tableName: string
}) => (
  <Table
    data={persons}
    header={{
      fullName: <Trans>Patient Name</Trans>,
      birthDate: <Trans>Date of birth</Trans>,
      taxId: <Trans>INN</Trans>,
      unzr: <Trans>Record ID in EDDR</Trans>,
      authenticationMethods: <Trans>Authentication method</Trans>,
      insertedAt: <Trans>Added</Trans>,
      status: <Trans>Status</Trans>,
      action: <Trans>Action</Trans>
    }}
    renderRow={({
      id,
      birthDate,
      taxId,
      unzr,
      authenticationMethods,
      insertedAt,
      status,
      ...person
    }) => ({
      ...person,
      fullName: getFullName(person),
      birthDate: formatDate(birthDate),
      taxId: taxId || "—",
      unzr: unzr || "—",
      insertedAt: (
        <DateFormat
          value={insertedAt}
          format={{
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
          }}
        />
      ),
      authenticationMethods: <AuthMethodsList data={authenticationMethods} />,
      status: <Badge type="PERSON" name={status} display="block" />,
      action: (
        <Link to={`/persons/${id}`} fontWeight="bold">
          <Trans>Show details</Trans>
        </Link>
      )
    })}
    sortableFields={["birthDate", "taxId", "unzr", "insertedAt"]}
    sortingParams={parseSortingParams(locationParams.orderBy)}
    onSortingChange={sortingParams =>
      setLocationParams({
        ...locationParams,
        orderBy: stringifySortingParams(sortingParams)
      })
    }
    tableName={tableName}
  />
);

PersonsTable.fragments = {
  entry: gql`
    fragment Persons on Person {
      id
      firstName
      lastName
      secondName
      birthDate
      unzr
      taxId
      insertedAt
      status
      authenticationMethods {
        type
        phoneNumber
      }
    }
  `
};

export default PersonsTable;
