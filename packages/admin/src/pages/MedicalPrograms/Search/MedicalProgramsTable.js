//@flow
import React from "react";
import gql from "graphql-tag";
import { DateFormat, Trans } from "@lingui/macro";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";

import type { DocumentNode } from "graphql";
import type { MedicalProgram } from "@ehealth-ua/schema";
import type {
  SetLocationParamsProp,
  URLSearchParams
} from "@ehealth/components";

import Badge from "../../../components/Badge";
import Table from "../../../components/Table";
import DictionaryValue from "../../../components/DictionaryValue";

import DeactivateMedicalProgram from "./DeactivateMedicalProgram";

const MedicalProgramsTable = ({
  medicalPrograms,
  locationParams,
  setLocationParams,
  medicalProgramsQuery
}: {
  medicalPrograms: Array<MedicalProgram>,
  locationParams: URLSearchParams,
  setLocationParams: SetLocationParamsProp,
  medicalProgramsQuery: DocumentNode
}) => (
  <Table
    data={medicalPrograms}
    header={{
      databaseId: <Trans>ID</Trans>,
      name: <Trans>Medical program name</Trans>,
      isActive: <Trans>Status</Trans>,
      type: <Trans>Type</Trans>,
      insertedAt: <Trans>Inserted at</Trans>,
      action: <Trans>Action</Trans>
    }}
    renderRow={({
      id,
      insertedAt,
      isActive,
      name,
      type,
      ...medicalProgram
    }) => ({
      ...medicalProgram,
      name,
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
      isActive: (
        <Badge
          type="MEDICAL_PROGRAM_STATUS"
          name={isActive}
          variant={!isActive}
          display="block"
        />
      ),
      type: <DictionaryValue name="MEDICAL_PROGRAM_TYPE" item={type} />,
      action: (
        <DeactivateMedicalProgram
          id={id}
          isActive={isActive}
          name={name}
          locationParams={locationParams}
          medicalProgramsQuery={medicalProgramsQuery}
        />
      )
    })}
    sortableFields={["name", "insertedAt"]}
    sortingParams={parseSortingParams(locationParams.orderBy)}
    onSortingChange={sortingParams =>
      setLocationParams({
        ...locationParams,
        orderBy: stringifySortingParams(sortingParams)
      })
    }
    whiteSpaceNoWrap={["databaseId"]}
    tableName="medicalPrograms/search"
  />
);

MedicalProgramsTable.fragments = {
  entry: gql`
    fragment MedicalPrograms on MedicalProgram {
      id
      databaseId
      name
      isActive
      insertedAt
      type
    }
  `
};

export default MedicalProgramsTable;
