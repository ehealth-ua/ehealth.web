import React from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";
import { withRouter } from "react-router-dom";
import { getFullName, getSpecialities, getDictValue } from "@ehealth/utils";
import { Heading, Link, Button } from "@ehealth/components";
import DictionaryValue from "../components/DictionaryValue";

import DefinitionListView from "../components/DefinitionListView";

const EmployeePage = ({ match, history }) => (
  <Query
    query={gql`
      query($id: String!) {
        employee(id: $id)
          @rest(path: "/stats/employees/:id", type: "EmployeesPayload") {
          data
        }
      }
    `}
    variables={{ id: match.params.id }}
    context={{ credentials: "same-origin" }}
  >
    {({ loading, error, data }) => {
      const { employee } = data;
      if (!employee) return null;

      const { data: employeeData } = employee;
      const {
        party: {
          specialities,
          educations,
          qualifications,
          scienceDegree,
          workingExperience,
          aboutMyself
        }
      } = employeeData;

      return (
        <>
          <Heading.H1>Крок 2. Відправте запит на декларацію</Heading.H1>
          <DefinitionListSection>
            <SubTitle>
              {getFullName(employeeData.party)}
              <Link onClick={() => history.goBack()} size="xs" upperCase>
                Назад до результатів пошуку
              </Link>
            </SubTitle>
            <DefinitionListView
              labels={{
                divisionName: "Назва відділення",
                educations: "Освіта",
                qualifications: "Кваліфікація",
                scienceDegree: "Науковий ступінь",
                specialities: "Спеціалізація",
                workingExperience: "Стаж роботи",
                aboutMyself: "Про себе"
              }}
              data={{
                divisionName: employeeData.division.name,
                educations: educations.map((item, i) => (
                  <Text key={i}>
                    <Text>{item.speciality}</Text>
                    <Text>{item.institutionName}</Text>
                    <Text>
                      <DictionaryValue
                        name="EDUCATION_DEGREE"
                        item={item.degree}
                      />
                      <br />
                      Диплом №{item.diplomaNumber} від {item.issuedDate}
                    </Text>
                    <Text>
                      <DictionaryValue name="COUNTRY" item={item.country} />,{" "}
                      {item.city}
                    </Text>
                  </Text>
                )),
                qualifications: qualifications.map((item, i) => (
                  <Text key={i}>
                    <Text>{item.speciality}</Text>
                    <Text>{item.certificateNumber}</Text>
                    <Text>
                      <DictionaryValue
                        name="QUALIFICATION_TYPE"
                        item={item.type}
                      />
                      <br />
                      Сертифікат №{item.diplomaNumber} від {item.issuedDate}
                    </Text>
                  </Text>
                )),
                scienceDegree: (
                  <Text>
                    <Text>
                      <DictionaryValue
                        name="SPECIALITY_TYPE"
                        item={scienceDegree.speciality}
                      />
                    </Text>

                    <Text>{scienceDegree.institutionName}</Text>
                    <Text>
                      <DictionaryValue
                        name="SCIENCE_DEGREE"
                        item={scienceDegree.degree}
                      />{" "}
                      <br />
                      Диплом №{scienceDegree.diplomaNumber} від{" "}
                      {scienceDegree.issuedDate}
                    </Text>
                    <Text>
                      <DictionaryValue
                        name="COUNTRY"
                        item={scienceDegree.country}
                      />{" "}
                      , {scienceDegree.city}
                    </Text>
                  </Text>
                ),
                workingExperience,
                aboutMyself
              }}
            />
          </DefinitionListSection>
          <Button>Відправити запит на декларацію</Button>
        </>
      );
    }}
  </Query>
);

const DefinitionListSection = styled.div`
  margin: 30px 0;
  border-bottom: 1px solid #e7e7e9;
  &:last-of-type {
    border-bottom: none;
  }
`;

const SubTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  font-size: 16px;
`;

const Text = styled.div`
  margin-top: 10px;
  &:first-child {
    margin-top: 0;
  }
`;

export default withRouter(EmployeePage);
