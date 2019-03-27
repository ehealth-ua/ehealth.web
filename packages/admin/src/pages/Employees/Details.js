import React, { useState } from "react";
import isEmpty from "lodash/isEmpty";
import { loader } from "graphql.macro";
import { Router } from "@reach/router";
import { PositiveIcon } from "@ehealth/icons";
import { Mutation, Query } from "react-apollo";
import { Trans, DateFormat } from "@lingui/macro";
import { getFullName, getPhones } from "@ehealth/utils";
import { Box, Flex, Heading, Text } from "@rebass/emotion";

import Link from "../../components/Link";
import Line from "../../components/Line";
import Tabs from "../../components/Tabs";
import Popup from "../../components/Popup";
import Button from "../../components/Button";
import Ability from "../../components/Ability";
import Breadcrumbs from "../../components/Breadcrumbs";
import DocumentView from "../../components/DocumentView";
import LoadingOverlay from "../../components/LoadingOverlay";
import DictionaryValue from "../../components/DictionaryValue";
import DefinitionListView from "../../components/DefinitionListView";

const EmployeeQuery = loader("../../graphql/EmployeeQuery.graphql");

const DeactivateEmployee = loader(
  "../../graphql/DeactivateEmployeeMutation.graphql"
);

const Details = ({ id }) => {
  const [isVisible, setVisibilityState] = useState(false);
  const toggle = () => setVisibilityState(!isVisible);

  return (
    <Query query={EmployeeQuery} variables={{ id }}>
      {({ loading, error, data: { employee = {} } }) => {
        if (isEmpty(employee)) return null;
        const {
          databaseId,
          party,
          position,
          employeeType,
          startDate,
          endDate,
          legalEntity,
          division,
          status,
          isActive,
          additionalInfo: {
            specialities,
            educations,
            qualifications,
            scienceDegree
          } = {}
        } = employee;

        return (
          <LoadingOverlay loading={loading}>
            <Box p={6}>
              <Box py={10}>
                <Breadcrumbs.List>
                  <Breadcrumbs.Item to="/employees">
                    <Trans>Employees</Trans>
                  </Breadcrumbs.Item>
                  <Breadcrumbs.Item>
                    <Trans>Employee details</Trans>
                  </Breadcrumbs.Item>
                </Breadcrumbs.List>
              </Box>
              <Flex justifyContent="space-between" alignItems="flex-end">
                <Box>
                  <DefinitionListView
                    labels={{
                      databaseId: <Trans>Employee ID</Trans>,
                      name: <Trans>Name of employee</Trans>,
                      taxId: <Trans>INN</Trans>,
                      noTaxId: <Trans>No tax ID</Trans>
                    }}
                    data={{
                      databaseId,
                      taxId: party.taxId,
                      name: getFullName(party),
                      noTaxId: party.noTaxId && <PositiveIcon />
                    }}
                    color="#7F8FA4"
                    labelWidth="120px"
                  />
                </Box>
                {isActive && (
                  <Box>
                    <Ability action="deactivate" resource="employee">
                      <Mutation
                        mutation={DeactivateEmployee}
                        refetchQueries={() => [
                          {
                            query: EmployeeQuery,
                            variables: { id }
                          }
                        ]}
                      >
                        {deactivateEmployee => (
                          <>
                            <Button onClick={toggle} variant="red">
                              <Trans>Deactivate</Trans>
                            </Button>
                            <Popup
                              visible={isVisible}
                              onCancel={toggle}
                              title={
                                <>
                                  <Trans>Deactivate employee</Trans>{" "}
                                  {getFullName(party)}?
                                </>
                              }
                              okText={<Trans>Deactivate</Trans>}
                              onOk={async () => {
                                await deactivateEmployee({
                                  variables: {
                                    input: {
                                      id
                                    }
                                  }
                                });
                                toggle();
                              }}
                            />
                          </>
                        )}
                      </Mutation>
                    </Ability>
                  </Box>
                )}
              </Flex>
            </Box>
            <Tabs.Nav>
              <Tabs.NavItem to="./">
                <Trans>General info</Trans>
              </Tabs.NavItem>
              <Tabs.NavItem to="./education">
                <Trans>Education</Trans>
              </Tabs.NavItem>
            </Tabs.Nav>
            <Tabs.Content>
              <Router>
                <GeneralInfo
                  path="/"
                  party={party}
                  startDate={startDate}
                  endDate={endDate}
                  status={status}
                  position={position}
                  employeeType={employeeType}
                  division={division}
                  legalEntity={legalEntity}
                />
                <Education
                  path="education"
                  specialities={specialities}
                  educations={educations}
                  qualifications={qualifications}
                  scienceDegree={scienceDegree}
                />
              </Router>
            </Tabs.Content>
          </LoadingOverlay>
        );
      }}
    </Query>
  );
};

const GeneralInfo = ({
  party: {
    databaseId,
    birthDate,
    gender,
    phones,
    documents,
    email,
    workingExperience,
    aboutMyself
  },
  status,
  position,
  employeeType,
  startDate,
  endDate,
  division,
  legalEntity
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
        email: <Trans>Email</Trans>,
        documents: <Trans>Documents</Trans>
      }}
      data={{
        phones: getPhones(phones),
        email,
        documents:
          documents &&
          documents.map(({ type, ...documentDetails }, index) => (
            <Box key={index}>
              <Heading fontSize="0" fontWeight="bold" py={4}>
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
        status: <Trans>Status</Trans>,
        startDate: <Trans>Employment start date</Trans>,
        endDate: <Trans>Employment end date</Trans>,
        legalEntity: <Trans>Legal entity</Trans>,
        division: <Trans>Division</Trans>
      }}
      data={{
        position: <DictionaryValue name="POSITION" item={position} />,
        employeeType: (
          <DictionaryValue name="EMPLOYEE_TYPE" item={employeeType} />
        ),
        status: <DictionaryValue name="EMPLOYEE_STATUS" item={status} />,
        startDate: <DateFormat value={startDate} />,
        endDate: endDate && <DateFormat value={endDate} />,
        legalEntity: legalEntity && (
          <Link to={`../../legal-entities/${legalEntity.id}`} fontWeight="bold">
            <Trans>{legalEntity.name}</Trans>
          </Link>
        ),
        division: division && division.name
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

const Education = ({
  specialities,
  educations,
  qualifications,
  scienceDegree
}) => {
  return (
    <Box px={5} pt={5}>
      {specialities && (
        <EducationDefinitionList title="Specialities" data={specialities} />
      )}

      {educations && (
        <EducationDefinitionList title="Education" data={educations} />
      )}

      {qualifications && (
        <EducationDefinitionList title="Qualifications" data={qualifications} />
      )}

      {scienceDegree && (
        <EducationDefinitionList title="Science degree" data={scienceDegree} />
      )}
    </Box>
  );
};

export default Details;

const EducationDefinitionList = ({ title, data }) => (
  <>
    <Text fontSize={2} mb={6}>
      <Trans>{title}</Trans>
    </Text>
    {data.map(
      ({
        attestationDate,
        attestationName,
        certificateNumber,
        level,
        qualificationType,
        speciality,
        specialityOfficio,
        validToDate,
        city,
        country,
        degree,
        diplomaNumber,
        institutionName,
        issuedDate,
        type
      }) => (
        <>
          <DefinitionListView
            labels={{
              degree: <Trans>Degree</Trans>,
              speciality: <Trans>Speciality</Trans>,
              diplomaNumber: <Trans>Diploma number</Trans>,
              institutionName: <Trans>Institution name</Trans>,
              issuedDate: <Trans>Issued date</Trans>,
              place: <Trans>Place of receipt</Trans>,
              type: <Trans>Speciality type</Trans>,
              level: <Trans>Speciality level</Trans>,
              qualificationType: <Trans>Qualification type</Trans>,
              certificateNumber: <Trans>Certificate number</Trans>,
              validToDate: <Trans>Valid to date</Trans>,
              attestationName: <Trans>Attestation name</Trans>,
              attestationDate: <Trans>Attestation date</Trans>
            }}
            data={{
              speciality: speciality && (
                <DictionaryValue name="SPECIALITY_TYPE" item={speciality} />
              ),
              level: level && (
                <DictionaryValue name="SPECIALITY_LEVEL" item={level} />
              ),
              qualificationType: qualificationType && (
                <DictionaryValue
                  name="SPEC_QUALIFICATION_TYPE"
                  item={qualificationType}
                />
              ),
              certificateNumber,
              validToDate: validToDate && <DateFormat value={validToDate} />,
              attestationName,
              attestationDate: attestationDate && (
                <DateFormat value={attestationDate} />
              ),
              degree: degree && (
                <DictionaryValue name="EDUCATION_DEGREE" item={degree} />
              ),
              diplomaNumber,
              institutionName,
              issuedDate: issuedDate && <DateFormat value={issuedDate} />,
              place: country && city && `${country}, ${city}`,
              type: type && (
                <DictionaryValue name="QUALIFICATION_TYPE" item={type} />
              )
            }}
            labelWidth="180px"
          />
          <Line />
        </>
      )
    )}
  </>
);