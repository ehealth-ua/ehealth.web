import React from "react";
import styled from "react-emotion/macro";
import { Query, Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";
import { getFullName } from "@ehealth/utils";
import { Heading, Link, Button, Form, SUBMIT_ERROR } from "@ehealth/components";

import DictionaryValue from "../components/DictionaryValue";
import DefinitionListView from "../components/DefinitionListView";

import CreateDeclarationRequestMutation from "../graphql/CreateDeclarationRequestMutation.graphql";
import EmployeeQuery from "../graphql/EmployeeQuery.graphql";
import PersonQuery from "../graphql/PersonQuery.graphql";

class EmployeePage extends React.Component {
  state = {
    error: false
  };

  render() {
    const { match, history } = this.props;
    return (
      <Query
        query={EmployeeQuery}
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
            },
            id: employee_id,
            division: { id: division_id }
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
              <Query query={PersonQuery}>
                {({ loading, error, data }) => {
                  if (!data.person) return null;
                  const { data: { id: person_id } } = data.person;
                  return (
                    <Mutation mutation={CreateDeclarationRequestMutation}>
                      {createDeclarationRequest => (
                        <>
                          <Block>
                            <Form
                              onSubmit={async () => {
                                try {
                                  const variables = {
                                    input: {
                                      person_id,
                                      employee_id,
                                      division_id
                                    }
                                  };
                                  const {
                                    data
                                  } = await createDeclarationRequest({
                                    variables
                                  });
                                  const { id } = data.declarations.data;
                                  history.push(`/declaration_requests/${id}`);
                                } catch ({ networkError }) {
                                  return {
                                    [SUBMIT_ERROR]:
                                      networkError.result.error.invalid
                                  };
                                }
                              }}
                            >
                              <Form.Error
                                invalid_age="Спеціальність лікаря не відповідає вашому віковому діапазону."
                                employee_unemployed="Неможливо підписати декларацію. Лікар на разі не влаштований до лікарні."
                                default="Щось пішло не так. Спробуйте обрати іншого лікаря."
                              />
                              <Form.Submit
                                size="small"
                                disabled={this.state.error}
                              >
                                Відправити запит на декларацію
                              </Form.Submit>
                            </Form>
                          </Block>
                        </>
                      )}
                    </Mutation>
                  );
                }}
              </Query>
            </>
          );
        }}
      </Query>
    );
  }
}

const Block = styled.div`
  padding: 20px 0;
`;

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
