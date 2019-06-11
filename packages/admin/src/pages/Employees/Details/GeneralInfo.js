//@flow
import React from "react";
import gql from "graphql-tag";
import { getPhones } from "@ehealth/utils";
import { Box, Heading } from "@rebass/emotion";
import { DateFormat, Trans } from "@lingui/macro";
import type {
  Party,
  Employee,
  Division,
  LegalEntity
} from "@ehealth-ua/schema";

import Link from "../../../components/Link";
import Line from "../../../components/Line";
import DocumentView from "../../../components/DocumentView";
import DictionaryValue from "../../../components/DictionaryValue";
import DefinitionListView from "../../../components/DefinitionListView";

const GeneralInfo = ({
  party: {
    databaseId,
    birthDate,
    gender,
    phones,
    documents,
    workingExperience,
    aboutMyself
  },
  isActive,
  position,
  employeeType,
  startDate,
  endDate,
  division,
  legalEntity
}: {
  party: Party,
  isActive: Employee.isActive,
  position: Employee.position,
  employeeType: Employee.employeeType,
  startDate: Employee.startDate,
  endDate: Employee.endDate,
  division: Division,
  legalEntity: LegalEntity
}) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        databaseId: <Trans>Person ID</Trans>
      }}
      data={{
        databaseId
      }}
      color="#7F8FA4"
    />
    <DefinitionListView
      labels={{
        birthDate: <Trans>Date of birth</Trans>,
        gender: <Trans>Gender</Trans>
      }}
      data={{
        birthDate: <DateFormat value={birthDate} />,
        gender: <DictionaryValue name="GENDER" item={gender} />
      }}
    />
    <Line />
    <DefinitionListView
      labels={{
        phones: <Trans>Phones</Trans>,
        documents: <Trans>Documents</Trans>
      }}
      data={{
        phones: getPhones(phones),
        documents:
          documents &&
          documents.map(({ type, ...documentDetails }, index) => (
            <Box key={index} pb={4}>
              <Heading fontSize="0" fontWeight="bold" pb={4}>
                <DictionaryValue name="DOCUMENT_TYPE" item={type} />
              </Heading>
              <DocumentView data={documentDetails} />
            </Box>
          ))
      }}
    />
    <Line />
    <DefinitionListView
      labels={{
        position: <Trans>Position</Trans>,
        employeeType: <Trans>Employee type</Trans>,
        startDate: <Trans>Employment start date</Trans>,
        endDate: <Trans>Employment end date</Trans>,
        legalEntity: <Trans>Legal entity</Trans>,
        division: <Trans>Division</Trans>,
        isActive: <Trans>Is employee active</Trans>
      }}
      data={{
        position: <DictionaryValue name="POSITION" item={position} />,
        employeeType: (
          <DictionaryValue name="EMPLOYEE_TYPE" item={employeeType} />
        ),
        startDate: <DateFormat value={startDate} />,
        endDate: endDate && <DateFormat value={endDate} />,
        legalEntity: legalEntity && (
          <Link to={`../../legal-entities/${legalEntity.id}`} fontWeight="bold">
            {legalEntity.name}
          </Link>
        ),
        division: division && division.name,
        isActive: isActive ? <Trans>Yes</Trans> : <Trans>No</Trans>
      }}
    />

    {(workingExperience || aboutMyself) && (
      <>
        <Line />
        <DefinitionListView
          labels={{
            workingExperience: <Trans>Working experience</Trans>,
            aboutMyself: <Trans>About myself</Trans>
          }}
          data={{
            workingExperience,
            aboutMyself
          }}
        />
      </>
    )}
  </Box>
);

GeneralInfo.fragments = {
  entry: gql`
    fragment GeneralInfo on Employee {
      party {
        databaseId
        birthDate
        gender
        phones {
          number
          type
        }
        documents {
          type
          number
          issuedBy
          issuedAt
        }
        aboutMyself
        workingExperience
      }
      position
      startDate
      endDate
      isActive
      division {
        id
        databaseId
        name
      }
    }
  `
};

export default GeneralInfo;
