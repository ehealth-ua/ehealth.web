//@flow
import React from "react";
import gql from "graphql-tag";
import { Box } from "@rebass/emotion";
import { Trans, DateFormat } from "@lingui/macro";
import { Link } from "@ehealth/components";

import type { Scalars, ProgramMedication } from "@ehealth-ua/schema";

import Line from "../../../components/Line";
import Price from "../../../components/Price";
import DefinitionListView from "../../../components/DefinitionListView";

import UpdateReimbursementAmount from "./Mutations/UpdateReimbursementAmount";

const GeneralInfo = ({
  isActive,
  details: {
    id,
    wholesalePrice,
    consumerPrice,
    estimatedPaymentAmount,
    reimbursementDailyDosage,
    medication,
    medicalProgram,
    reimbursement,
    startDate,
    endDate,
    registryNumber
  }
}: {
  isActive: ProgramMedication.isActive,
  details: {
    id: Scalars.ID,
    wholesalePrice: ProgramMedication.wholesalePrice,
    consumerPrice: ProgramMedication.consumerPrice,
    estimatedPaymentAmount: ProgramMedication.estimatedPaymentAmount,
    reimbursementDailyDosage: ProgramMedication.reimbursementDailyDosage,
    medication: ProgramMedication.medication,
    medicalProgram: ProgramMedication.medicalProgram,
    reimbursement: ProgramMedication.reimbursement,
    startDate: ProgramMedication.startDate,
    endDate: ProgramMedication.endDate,
    registryNumber: ProgramMedication.registryNumber
  }
}) => {
  const {
    id: medicationId,
    databaseId: medicationDatabaseId,
    name: medicationName
  } = medication;
  const {
    databaseId: medicalProgramId,
    name: medicalProgramName
  } = medicalProgram;
  const { type, reimbursementAmount } = reimbursement;

  return (
    <Box p={5}>
      <DefinitionListView
        labels={{
          medicationName: <Trans>Medication name</Trans>
        }}
        data={{
          medicationName
        }}
        labelWidth="280px"
      />
      <DefinitionListView
        labels={{
          medicationId: <Trans>Medication ID</Trans>
        }}
        data={{
          medicationId: (
            <Link to={`/medications/${medicationId}`}>
              {medicationDatabaseId}
            </Link>
          )
        }}
        color="blueberrySoda"
        labelWidth="280px"
      />
      <Line />
      <DefinitionListView
        labels={{
          medicalProgramName: <Trans>Medical program name</Trans>
        }}
        data={{
          medicalProgramName
        }}
        labelWidth="280px"
      />
      <DefinitionListView
        labels={{
          medicalProgramId: <Trans>Medical program ID</Trans>
        }}
        data={{
          medicalProgramId: (
            <Link
              to={`/medical-programs/search?first=10&filter.databaseId=${medicalProgramId}`}
            >
              {medicalProgramId}
            </Link>
          )
        }}
        color="blueberrySoda"
        labelWidth="280px"
      />
      <Line />
      <DefinitionListView
        labels={{
          type: <Trans>Reimbursement type</Trans>,
          reimbursementAmount: (
            <Trans>
              Reimbursement amount for the package of the medicinal product
            </Trans>
          ),
          wholesalePrice: <Trans>Wholesale price</Trans>,
          consumerPrice: <Trans>Consumer price</Trans>,
          estimatedPaymentAmount: <Trans>Estimated payment amount</Trans>,
          reimbursementDailyDosage: <Trans>Reimbursement daily dosage</Trans>,
          startDate: <Trans>Start date</Trans>,
          endDate: <Trans>End date</Trans>,
          registryNumber: <Trans>Registry number</Trans>
        }}
        data={{
          type,
          reimbursementAmount: isActive ? (
            <UpdateReimbursementAmount
              id={id}
              reimbursementAmount={reimbursementAmount}
            />
          ) : (
            <Price amount={reimbursementAmount} />
          ),
          wholesalePrice: wholesalePrice && <Price amount={wholesalePrice} />,
          consumerPrice: consumerPrice && <Price amount={consumerPrice} />,
          estimatedPaymentAmount: estimatedPaymentAmount && (
            <Price amount={estimatedPaymentAmount} />
          ),
          reimbursementDailyDosage: reimbursementDailyDosage && (
            <Price amount={reimbursementDailyDosage} />
          ),
          startDate: startDate ? <DateFormat value={startDate} /> : "-",
          endDate: endDate ? <DateFormat value={endDate} /> : "-",
          registryNumber: registryNumber ? registryNumber : "-"
        }}
        labelWidth="280px"
      />
    </Box>
  );
};

GeneralInfo.fragments = {
  entry: gql`
    fragment ProgramMedicationGeneralInfo on ProgramMedication {
      wholesalePrice
      consumerPrice
      estimatedPaymentAmount
      reimbursementDailyDosage
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
      }
      medication {
        id
        databaseId
        name
        isActive
        type
      }
    }
  `
};

export default GeneralInfo;
