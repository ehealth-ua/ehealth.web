//@flow
import React from "react";
import gql from "graphql-tag";
import { DateFormat, Trans } from "@lingui/macro";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";

import type { ProgramMedication } from "@ehealth-ua/schema";
import type {
  URLSearchParams,
  SetLocationParamsProp
} from "@ehealth/components";

import Link from "../../../components/Link";
import Badge from "../../../components/Badge";
import Table from "../../../components/Table";
import DictionaryValue from "../../../components/DictionaryValue";

const ProgramMedicationsTable = ({
  programMedications,
  locationParams,
  setLocationParams,
  tableName = "programMedications/search"
}: {
  programMedications: Array<ProgramMedication>,
  locationParams: URLSearchParams,
  setLocationParams: SetLocationParamsProp,
  tableName: string
}) => (
  <Table
    data={programMedications}
    header={{
      medicalProgramId: <Trans>Medical program ID</Trans>,
      medicalProgramName: <Trans>Medical program name</Trans>,
      medicationName: <Trans>Medication name</Trans>,
      medicationForm: <Trans>Medication form</Trans>,
      medicationManufacturer: <Trans>Medication manufacturer</Trans>,
      reimbursementAmount: <Trans>Reimbursement amount</Trans>,
      isActive: <Trans>Status</Trans>,
      registryNumber: <Trans>Registry number</Trans>,
      insertedAt: <Trans>Inserted at</Trans>,
      startDate: <Trans>Start date</Trans>,
      endDate: <Trans>End date</Trans>,
      details: <Trans>Details</Trans>
    }}
    renderRow={({
      id,
      isActive,
      insertedAt,
      registryNumber,
      startDate,
      endDate,
      medicalProgram: {
        databaseId: medicalProgramId,
        name: medicalProgramName
      },
      medication: {
        name: medicationName,
        form: medicationForm,
        manufacturer: medicationManufacturer
      },
      reimbursement: { reimbursementAmount }
    }) => {
      return {
        medicalProgramId,
        medicalProgramName,
        medicationName,
        medicationForm: (
          <DictionaryValue name="MEDICATION_FORM" item={medicationForm} />
        ),
        medicationManufacturer: medicationManufacturer && (
          <>
            {medicationManufacturer.name}, {medicationManufacturer.country}
          </>
        ),
        isActive: (
          <Badge
            type="PROGRAM_MEDICATION_STATUS"
            name={isActive}
            variant={!isActive}
            display="block"
          />
        ),
        reimbursementAmount,
        startDate: startDate ? <DateFormat value={startDate} /> : "-",
        endDate: endDate ? <DateFormat value={endDate} /> : "-",
        registryNumber: registryNumber ? registryNumber : "-",
        insertedAt: <DateFormat value={insertedAt} />,
        details: (
          <Link to={`../${id}`} fontWeight="bold">
            <Trans>Show details</Trans>
          </Link>
        )
      };
    }}
    sortableFields={["insertedAt"]}
    sortingParams={parseSortingParams(locationParams.orderBy)}
    onSortingChange={sortingParams =>
      setLocationParams({
        ...locationParams,
        orderBy: stringifySortingParams(sortingParams)
      })
    }
    whiteSpaceNoWrap={["medicalProgramId"]}
    tableName={tableName}
  />
);

ProgramMedicationsTable.fragments = {
  entry: gql`
    fragment ProgramMedications on ProgramMedication {
      id
      databaseId
      isActive
      insertedAt
      startDate
      endDate
      registryNumber
      reimbursement {
        type
        reimbursementAmount
      }
      medicalProgram {
        id
        databaseId
        name
        isActive
        insertedAt
        updatedAt
      }
      medication {
        id
        databaseId
        name
        form
        manufacturer {
          name
          country
        }
        isActive
      }
    }
  `
};

export default ProgramMedicationsTable;
