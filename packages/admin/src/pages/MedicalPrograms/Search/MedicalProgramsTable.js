import React from "react";
import gql from "graphql-tag";
import { DateFormat, Trans } from "@lingui/macro";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";

import Badge from "../../../components/Badge";
import Table from "../../../components/Table";

import DeactivateMedicalProgram from "./DeactivateMedicalProgram";

const MedicalProgramsTable = ({
  medicalPrograms,
  locationParams,
  setLocationParams,
  medicalProgramsQuery
}) => (
  <Table
    data={medicalPrograms}
    header={{
      databaseId: <Trans>ID</Trans>,
      name: <Trans>Medical program name</Trans>,
      isActive: <Trans>Status</Trans>,
      insertedAt: <Trans>Inserted at</Trans>,
      action: <Trans>Action</Trans>
    }}
    renderRow={({ id, insertedAt, isActive, ...medicalProgram }) => ({
      ...medicalProgram,
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
      action: (
        <DeactivateMedicalProgram
          id={id}
          isActive={isActive}
          name={medicalProgram.name}
          locationParams={locationParams}
          refetchQuery={medicalProgramsQuery}
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
    }
  `
};

export default MedicalProgramsTable;
