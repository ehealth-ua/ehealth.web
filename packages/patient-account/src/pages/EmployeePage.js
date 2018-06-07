import React from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";
import { withRouter } from "react-router-dom";
import { getFullName, getSpecialities, getDictValue } from "@ehealth/utils";
import { Title, Link, Button } from "@ehealth/components";
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
          science_degree: scienceDegree,
          working_experience: workingExperience,
          about_myself: aboutMyself
        }
      } = employeeData;
      return (
        <>
          <Title.H1>Крок 2. Відправте запит на декларацію</Title.H1>
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
                    <Text>{item.institution_name}</Text>
                    <Text>
                      <DictionaryValue
                        name="EDUCATION_DEGREE"
                        render={v => v[item.degree]}
                      />
                      <br />
                      Диплом №{item.diploma_number} від {item.issued_date}
                    </Text>
                    <Text>
                      <DictionaryValue
                        name="COUNTRY"
                        render={v => v[item.country]}
                      />, {item.city}
                    </Text>
                  </Text>
                )),
                qualifications: qualifications.map((item, i) => (
                  <Text key={i}>
                    <Text>{item.speciality}</Text>
                    <Text>{item.certificate_number}</Text>
                    <Text>
                      <DictionaryValue
                        name="QUALIFICATION_TYPE"
                        render={v => v[item.type]}
                      />
                      <br />
                      Сертифікат №{item.diploma_number} від {item.issued_date}
                    </Text>
                  </Text>
                )),
                scienceDegree: (
                  <Text>
                    <Text>
                      <DictionaryValue
                        name="SPECIALITY_TYPE"
                        render={v => v[scienceDegree.speciality]}
                      />
                    </Text>

                    <Text>{scienceDegree.institution_name}</Text>
                    <Text>
                      <DictionaryValue
                        name="SCIENCE_DEGREE"
                        render={v => v[scienceDegree.degree]}
                      />{" "}
                      <br />
                      Диплом №{scienceDegree.diploma_number} від{" "}
                      {scienceDegree.issued_date}
                    </Text>
                    <Text>
                      <DictionaryValue
                        name="COUNTRY"
                        render={v => v[scienceDegree.country]}
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
