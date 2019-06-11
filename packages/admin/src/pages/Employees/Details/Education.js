//@flow
import React from "react";
import gql from "graphql-tag";
import { Box, Text } from "@rebass/emotion";
import { DateFormat, Trans } from "@lingui/macro";
import type { EmployeeAdditionalInfo } from "@ehealth-ua/schema";
import Line from "../../../components/Line";
import DictionaryValue from "../../../components/DictionaryValue";
import DefinitionListView from "../../../components/DefinitionListView";
import EmptyData from "../../../components/EmptyData";

const Education = ({
  specialities,
  educations,
  qualifications,
  scienceDegree
}: {
  specialities: EmployeeAdditionalInfo.specialities,
  educations: EmployeeAdditionalInfo.educations,
  qualifications: EmployeeAdditionalInfo.qualifications,
  scienceDegree: EmployeeAdditionalInfo.scienceDegree
}) =>
  specialities || educations || qualifications || scienceDegree ? (
    <Box px={5} pt={5}>
      {specialities && (
        <EducationDefinitionList
          title={<Trans>Specialities</Trans>}
          data={specialities}
        />
      )}

      {educations && (
        <EducationDefinitionList
          title={<Trans>Education</Trans>}
          data={educations}
        />
      )}

      {qualifications && (
        <EducationDefinitionList
          title={<Trans>Qualifications</Trans>}
          data={qualifications}
        />
      )}

      {scienceDegree && (
        <>
          <Text fontSize={2} mb={6}>
            <Trans>Science degree</Trans>
          </Text>
          {scienceDegree.map(
            ({
              degree,
              speciality,
              diplomaNumber,
              institutionName,
              issuedDate,
              city,
              country
            }) => (
              <>
                <DefinitionListView
                  labels={{
                    degree: <Trans>Science degree</Trans>,
                    speciality: <Trans>Speciality</Trans>,
                    diplomaNumber: <Trans>Diploma number</Trans>,
                    institutionName: <Trans>Institution name</Trans>,
                    issuedDate: <Trans>Issued date</Trans>,
                    place: <Trans>Place of receipt</Trans>
                  }}
                  data={{
                    speciality: speciality && (
                      <DictionaryValue
                        name="SPECIALITY_TYPE"
                        item={speciality}
                      />
                    ),
                    degree: degree && (
                      <DictionaryValue name="SCIENCE_DEGREE" item={degree} />
                    ),
                    diplomaNumber,
                    institutionName,
                    issuedDate: issuedDate && <DateFormat value={issuedDate} />,
                    place: country &&
                      city && (
                        <>
                          <DictionaryValue name="COUNTRY" item={country} />,{" "}
                          {city}
                        </>
                      )
                  }}
                  labelWidth="180px"
                />
                <Line />
              </>
            )
          )}
        </>
      )}
    </Box>
  ) : (
    <EmptyData />
  );

const EducationDefinitionList = ({ title, data }) => (
  <>
    <Text fontSize={2} mb={6}>
      {title}
    </Text>
    {data.map(
      ({
        attestationDate,
        attestationName,
        certificateNumber,
        level,
        qualificationType,
        speciality,
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
              place: country &&
                city && (
                  <>
                    <DictionaryValue name="COUNTRY" item={country} />, {city}
                  </>
                ),
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

Education.fragments = {
  entry: gql`
    fragment Education on Employee {
      additionalInfo {
        specialities {
          attestationDate
          attestationName
          certificateNumber
          level
          qualificationType
          speciality
          validToDate
        }
        educations {
          city
          country
          degree
          diplomaNumber
          institutionName
          issuedDate
          speciality
        }
        qualifications {
          certificateNumber
          institutionName
          issuedDate
          speciality
          type
        }
        scienceDegree {
          city
          country
          degree
          diplomaNumber
          institutionName
          issuedDate
          speciality
        }
      }
    }
  `
};

export default Education;
