import React from "react";
import { Router } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import { loader } from "graphql.macro";
import { Flex, Box } from "rebass/emotion";
import system from "system-components/emotion";
import { BooleanValue } from "react-values";
import isEmpty from "lodash/isEmpty";
import { FieldArray } from "react-final-form-arrays";

import { Form, Validation } from "@ehealth/components";
import {
  PositiveIcon,
  DropDownButton as PlusIcon,
  RemoveItemIcon
} from "@ehealth/icons";

import Tabs from "../../components/Tabs";
import Table from "../../components/Table";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  SearchIcon,
  SelectedItem,
  RemoveItem
} from "../../components/MultiSelectView";
import DefinitionListView from "../../components/DefinitionListView";

const DictionariesQuery = loader(
  "../../graphql/SearchDictionariesQuery.graphql"
);
const UpdateDictionaryMutation = loader(
  "../../graphql/UpdateDictionaryMutation.graphql"
);

const Details = ({ name }) => (
  <Query query={DictionariesQuery} variables={{ first: 1, filter: { name } }}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;

      const { nodes: dictionaries = [] } = data.dictionaries;

      const { id, isActive, labels, values } = dictionaries[0];
      const isReadOnly = labels.includes("READ_ONLY");

      return (
        <>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/dictionaries">Словники</Breadcrumbs.Item>
                <Breadcrumbs.Item>Редагування словника</Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <Flex justifyContent="space-between">
              <Box>
                <DefinitionListView
                  labels={{
                    name: "Назва",
                    status: "Статус"
                  }}
                  data={{
                    name,
                    status: isActive && <PositiveIcon />
                  }}
                  labelWidth="100px"
                />
              </Box>
            </Flex>
          </Box>

          <Tabs.Nav>
            <Tabs.NavItem to="./">Значення</Tabs.NavItem>
            <Tabs.NavItem to="./labels">Теги</Tabs.NavItem>
          </Tabs.Nav>
          <Tabs.Content>
            <Router>
              <DictionaryValues
                path="/"
                isReadOnly={isReadOnly}
                values={values}
                id={id}
                name={name}
              />
              <DictionaryLabels
                path="/labels"
                isReadOnly={isReadOnly}
                labels={labels}
                id={id}
                name={name}
              />
            </Router>
          </Tabs.Content>
        </>
      );
    }}
  </Query>
);

const DictionaryLabels = ({ isReadOnly, labels, id, name }) => {
  //Hard-coded data is a temporary but necessary solution
  const listOfLabels = ["SYSTEM", "EXTERNAL", "ADMIN", "TRANSLATIONS"];
  const aviableLabels = listOfLabels.filter(item => !labels.includes(item));

  return (
    <Mutation
      mutation={UpdateDictionaryMutation}
      refetchQueries={() => [
        {
          query: DictionariesQuery,
          variables: { first: 1, filter: { name } }
        }
      ]}
    >
      {updateDictionary => (
        <Box px={5} py={4}>
          <DefinitionListView
            labels={{
              labels: "Теги"
            }}
            data={{
              labels: (
                <Flex>
                  {labels.map(label => (
                    <SelectedItem key={label} mx={1}>
                      {label}
                      {!isReadOnly && (
                        <RemoveItem
                          onClick={() => {
                            const updatedLabelsList = labels.filter(
                              item => item !== label
                            );

                            updateDictionary({
                              variables: {
                                input: {
                                  id,
                                  labels: updatedLabelsList
                                }
                              }
                            });
                          }}
                        >
                          <RemoveItemIcon />
                        </RemoveItem>
                      )}
                    </SelectedItem>
                  ))}
                </Flex>
              )
            }}
            labelWidth="100px"
            alignItems="center"
          />

          {!isReadOnly && (
            <BooleanValue>
              {({ value: opened, toggle }) => (
                <>
                  <AddButton onClick={toggle}>
                    <Flex>
                      <Box mr={2}>
                        <PlusIcon width={16} height={16} />
                      </Box>
                      Додати тег
                    </Flex>
                  </AddButton>
                  {opened && (
                    <Box mt={2} width={1 / 3}>
                      <Form
                        onSubmit={({ addNewLabel }) => {
                          addNewLabel &&
                            updateDictionary({
                              variables: {
                                input: {
                                  id,
                                  labels: [...labels, addNewLabel]
                                }
                              }
                            });

                          toggle();
                        }}
                      >
                        <Field.Select
                          name="addNewLabel"
                          label="Виберіть тег"
                          placeholder="Оберіть тег зі списку"
                          items={aviableLabels}
                          renderItem={item => item}
                          hideErrors
                        />

                        <Button variant="green" mt={4}>
                          Зберегти
                        </Button>
                      </Form>
                    </Box>
                  )}
                </>
              )}
            </BooleanValue>
          )}
        </Box>
      )}
    </Mutation>
  );
};

class DictionaryValues extends React.Component {
  state = {
    filterKey: null,
    filterDescription: null,
    fieldToEdit: null
  };

  editFormRef = React.createRef();

  render() {
    const { isReadOnly, values, id, name } = this.props;
    const arrayOfValues = Object.entries(values).map(([key, description]) => ({
      key,
      description
    }));
    const filteredValues =
      this.state.filterKey || this.state.filterDescription
        ? [
            arrayOfValues.find(
              value =>
                value.key === this.state.filterKey ||
                value.description === this.state.filterDescription
            )
          ]
        : arrayOfValues;

    return (
      <Box p={5} innerRef={this.editFormRef}>
        {!this.state.fieldToEdit ? (
          <>
            <Flex justifyContent="space-between" color="darkAndStormy">
              Пошук значення
              {!isReadOnly && (
                <AddButton
                  onClick={() =>
                    this.setState({
                      fieldToEdit: { key: "", description: "" }
                    })
                  }
                >
                  <Flex>
                    <Box mr={2}>
                      <PlusIcon width={16} height={16} />
                    </Box>
                    Додати значення
                  </Flex>
                </AddButton>
              )}
            </Flex>

            <Form onSubmit={() => null}>
              <Form.AutoSubmit
                onSubmit={value => {
                  !isEmpty(value) &&
                    this.setState({
                      ...value
                    });
                }}
              />
              <Flex mx={-1} pt={5}>
                <Box px={1} width={1 / 3}>
                  <Field.Select
                    name="filterKey"
                    label="Ключ"
                    placeholder="Виберіть ключ"
                    items={Object.keys(values)}
                    renderItem={item => item}
                    hideErrors
                  />
                </Box>
                <Box px={1} width={2 / 3}>
                  <Field.Select
                    name="filterDescription"
                    label="Опис"
                    placeholder="Введіть опис"
                    items={Object.values(values)}
                    renderItem={item => item}
                    iconComponent={SearchIcon}
                    hideErrors
                  />
                </Box>
              </Flex>
            </Form>

            <Table
              data={filteredValues}
              header={{
                key: "Ключ",
                description: "Опис",
                ...(!isReadOnly && { action: "Дія" })
              }}
              renderRow={({ ...rowContent }) => ({
                ...rowContent,
                action: !isReadOnly && (
                  <AddButton
                    onClick={() =>
                      this.setState({
                        fieldToEdit: rowContent
                      })
                    }
                  >
                    Редагувати
                  </AddButton>
                )
              })}
              tableName="dictionaries/values"
            />
          </>
        ) : (
          <Mutation
            mutation={UpdateDictionaryMutation}
            refetchQueries={() => [
              {
                query: DictionariesQuery,
                variables: { first: 1, filter: { name } }
              }
            ]}
          >
            {updateDictionary => {
              this.editFormRef.current.scrollIntoView({
                block: "end",
                behavior: "smooth"
              });

              const submitMutationForm = (mutationValue = []) => {
                const valuesForMutation = this.getValuesForMutation(
                  mutationValue,
                  this.state.fieldToEdit,
                  arrayOfValues
                ).reduce(
                  (result, item) => ({
                    ...result,
                    ...{
                      [item.key]: item.description
                    }
                  }),
                  {}
                );

                const mutationValuesToJson = JSON.stringify(valuesForMutation);
                updateDictionary({
                  variables: {
                    input: {
                      id,
                      values: mutationValuesToJson
                    }
                  }
                });

                this.setState({
                  filterKey: null,
                  filterDescription: null,
                  fieldToEdit: null
                });
              };

              return (
                <Form
                  onSubmit={({ mutationValue }) => {
                    submitMutationForm(mutationValue);
                  }}
                  initialValues={{
                    mutationValue: this.state.fieldToEdit.key
                      ? [this.state.fieldToEdit]
                      : [{ key: "", description: "" }]
                  }}
                >
                  <FieldArray name="mutationValue">
                    {({ fields }) => (
                      <>
                        {fields.map((name, index) => (
                          <Flex mx={-1} key={name}>
                            <Box px={1} width={1 / 3}>
                              <Field.Text
                                name={`${name}.key`}
                                label={
                                  this.state.fieldToEdit.key
                                    ? "Ключ"
                                    : "Змінити ключ"
                                }
                                placeholder="Введіть ключ"
                              />
                              <Validation.Required
                                field={`${name}.key`}
                                message="Обов&#700;язкове поле"
                              />
                            </Box>
                            <Box px={1} width={1 / 3}>
                              <Field.Text
                                name={`${name}.description`}
                                label={
                                  this.state.fieldToEdit.key
                                    ? "Опис"
                                    : "Змінити опис"
                                }
                                placeholder="Введіть опис"
                              />
                              <Validation.Required
                                field={`${name}.description`}
                                message="Обов&#700;язкове поле"
                              />
                            </Box>
                            {!this.state.fieldToEdit.key ? (
                              <RemoveButtom
                                onClick={() => fields.remove(index)}
                              />
                            ) : (
                              <RemovalContainer>
                                <Button
                                  variant="red"
                                  onClick={() => {
                                    submitMutationForm();
                                  }}
                                >
                                  Видалити
                                </Button>
                              </RemovalContainer>
                            )}
                          </Flex>
                        ))}
                        {!this.state.fieldToEdit.key && (
                          <AddButton
                            onClick={() =>
                              fields.push({ key: "", description: "" })
                            }
                          >
                            <Flex>
                              <Box mr={2}>
                                <PlusIcon width={16} height={16} />
                              </Box>
                              Додати ще
                            </Flex>
                          </AddButton>
                        )}
                      </>
                    )}
                  </FieldArray>
                  <Flex mx={-2} pt={5}>
                    <Box px={2}>
                      <Button
                        variant="blue"
                        onClick={() =>
                          this.setState({
                            filterKey: null,
                            filterDescription: null,
                            fieldToEdit: null
                          })
                        }
                      >
                        Повернутися
                      </Button>
                    </Box>
                    <Box px={2}>
                      <Button variant="green">Зберегти та повернутися</Button>
                    </Box>
                  </Flex>
                </Form>
              );
            }}
          </Mutation>
        )}
      </Box>
    );
  }

  getValuesForMutation = (mutationValue, fieldToEdit, filteredValues) => {
    if (!mutationValue.length) {
      return filteredValues.filter(item => item.key !== fieldToEdit.key);
    }

    if (fieldToEdit.key) {
      const getValueIndex = filteredValues.findIndex(
        item => item.key === fieldToEdit.key
      );
      filteredValues.splice(getValueIndex, 1, mutationValue[0]);

      return filteredValues;
    } else {
      return [...filteredValues, ...mutationValue];
    }
  };
}

export default Details;

const RemoveButtom = system({
  is: RemoveItemIcon,
  color: "redPigment",
  alignSelf: "center",
  ml: 2
});

const RemovalContainer = system({
  is: Box,
  px: 4,
  mt: "-4px",
  alignSelf: "center"
});

const AddButton = system(
  {
    display: "inline-block",
    verticalAlign: "middle",
    fontSize: 0,
    fontWeight: "bold",
    color: "rockmanBlue"
  },
  `
    user-select: none;
    outline: none;
    text-decoration: none;
    cursor: pointer;
  `
);
