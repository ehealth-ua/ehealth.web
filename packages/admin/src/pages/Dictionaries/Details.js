import React from "react";
import { Router } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import { loader } from "graphql.macro";
import { Flex, Box } from "rebass/emotion";
import system from "system-components/emotion";
import { BooleanValue } from "react-values";
import isEmpty from "lodash/isEmpty";
import { FieldArray } from "react-final-form-arrays";
import { Trans } from "@lingui/macro";
import { Form, Validation, Validations } from "@ehealth/components";
import {
  PositiveIcon,
  NegativeIcon,
  DropDownButton as PlusIcon,
  RemoveItemIcon
} from "@ehealth/icons";

import Tabs from "../../components/Tabs";
import Table from "../../components/Table";
import Button from "../../components/Button";
import LoadingOverlay from "../../components/LoadingOverlay";
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
    {({
      loading,
      error,
      data: { dictionaries: { nodes: dictionaries = [] } = {} } = {}
    }) => {
      if (error) return `Error! ${error.message}`;
      const [{ id, isActive, labels = [], values = [] } = {}] = dictionaries;
      const isReadOnly = labels.includes("READ_ONLY");

      return (
        <LoadingOverlay loading={loading}>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/dictionaries">
                  <Trans>Dictionaries</Trans>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <Trans>Editing the dictionary</Trans>
                </Breadcrumbs.Item>
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
                    status: isActive ? <PositiveIcon /> : <NegativeIcon />
                  }}
                  labelWidth="100px"
                />
              </Box>
            </Flex>
          </Box>

          <Tabs.Nav>
            <Tabs.NavItem to="./">
              <Trans>Value</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./labels">
              <Trans>Tags</Trans>
            </Tabs.NavItem>
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
        </LoadingOverlay>
      );
    }}
  </Query>
);

const DictionaryLabels = ({ isReadOnly, labels, id, name }) => (
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
            labels: <Trans>Tags</Trans>
          }}
          data={{
            labels: (
              <Flex>
                {labels.map(label => (
                  <SelectedItem key={label} mx={1}>
                    {label}
                    {!isReadOnly &&
                      labels.length > 1 && (
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
                    <Trans>Add tag</Trans>
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
                      {
                        <Query
                          query={DictionariesQuery}
                          variables={{
                            first: 1,
                            filter: { name: "DICTIONARY_LABELS" }
                          }}
                        >
                          {({ loading, error, data }) => {
                            if (loading || error) return null;

                            const listOfLabels = !isEmpty(
                              data.dictionaries.nodes
                            )
                              ? Object.keys(data.dictionaries.nodes[0].values)
                              : [];
                            const aviableLabels = listOfLabels.filter(
                              item => !labels.includes(item)
                            );

                            return (
                              <Trans
                                id="Select tag from list"
                                render={({ translation }) => (
                                  <Field.Select
                                    name="addNewLabel"
                                    label={<Trans>Select a tag</Trans>}
                                    placeholder={translation}
                                    items={aviableLabels}
                                    renderItem={item => item}
                                    hideErrors
                                  />
                                )}
                              />
                            );
                          }}
                        </Query>
                      }
                      <Button variant="green" mt={4}>
                        <Trans>Save</Trans>
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
              <Trans>Search for a value</Trans>
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
                    <Trans>Add value</Trans>
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
                  <Trans
                    id="Select key"
                    render={({ translation }) => (
                      <Field.Select
                        name="filterKey"
                        label={<Trans>Key</Trans>}
                        placeholder={translation}
                        items={Object.keys(values)}
                        renderItem={item => item}
                        hideErrors
                      />
                    )}
                  />
                </Box>
                <Box px={1} width={2 / 3}>
                  <Trans
                    id="Enter description"
                    render={({ translation }) => (
                      <Field.Select
                        name="filterDescription"
                        label={<Trans>Description</Trans>}
                        placeholder={translation}
                        items={Object.values(values)}
                        renderItem={item => item}
                        iconComponent={SearchIcon}
                        hideErrors
                      />
                    )}
                  />
                </Box>
              </Flex>
            </Form>

            <Table
              data={filteredValues}
              header={{
                key: <Trans>Key</Trans>,
                description: <Trans>Description</Trans>,
                ...(!isReadOnly && { action: <Trans>Action</Trans> })
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
                    <Trans>Edit</Trans>
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
                block: "start",
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
                  <Trans
                    id="Enter value"
                    render={({ translation }) => (
                      <FieldArray name="mutationValue">
                        {({ fields }) => (
                          <>
                            {fields.map((name, index) => (
                              <Flex mx={-1} key={name}>
                                <Box px={1} width={1 / 3}>
                                  <Field.Text
                                    name={`${name}.key`}
                                    label={
                                      this.state.fieldToEdit.key ? (
                                        <Trans>Change key</Trans>
                                      ) : (
                                        <Trans>Key</Trans>
                                      )
                                    }
                                    placeholder={translation}
                                  />
                                  <Validations field={`${name}.key`}>
                                    <Validation.Required
                                      message={<Trans>Required field</Trans>}
                                    />
                                    <Validation.IsExists
                                      options={arrayOfValues
                                        .map(({ key }) => key)
                                        .filter(
                                          item =>
                                            item !== this.state.fieldToEdit.key
                                        )}
                                      message={
                                        <Trans>
                                          This key is already exists
                                        </Trans>
                                      }
                                    />
                                  </Validations>
                                </Box>
                                <Box px={1} width={1 / 3}>
                                  <Field.Text
                                    name={`${name}.description`}
                                    label={
                                      this.state.fieldToEdit.key ? (
                                        <Trans>Change description</Trans>
                                      ) : (
                                        <Trans>Description</Trans>
                                      )
                                    }
                                    placeholder={translation}
                                  />
                                  <Validation.Required
                                    field={`${name}.description`}
                                    message={<Trans>Required field</Trans>}
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
                                      disabled={arrayOfValues.length === 1}
                                      onClick={submitMutationForm}
                                    >
                                      <Trans>Delete</Trans>
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
                                  <Trans>Add another</Trans>
                                </Flex>
                              </AddButton>
                            )}
                          </>
                        )}
                      </FieldArray>
                    )}
                  />
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
                        <Trans>Return</Trans>
                      </Button>
                    </Box>
                    <Box px={2}>
                      <Button variant="green">
                        <Trans>Save and Return</Trans>
                      </Button>
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
