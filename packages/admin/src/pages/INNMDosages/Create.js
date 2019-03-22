import React from "react";
import isEmpty from "lodash/isEmpty";
import Composer from "react-composer";
import { I18n } from "@lingui/react";
import { Trans, t } from "@lingui/macro";
import debounce from "lodash/debounce";
import { loader } from "graphql.macro";
import { Router } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import system from "@ehealth/system-components";
import { Heading, Flex, Box, Text } from "@rebass/emotion";
import { Form, Validation, Validations } from "@ehealth/components";
import { DropDownButton as PlusIcon } from "@ehealth/icons";

import Line from "../../components/Line";
import Steps from "../../components/Steps";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import DictionaryValue from "../../components/DictionaryValue";
import DefinitionListView from "../../components/DefinitionListView";

const SearchINNMsQuery = loader("../../graphql/SearchINNMsQuery.graphql");
const CreateINNMDosageMutation = loader(
  "../../graphql/CreateINNMDosageMutation.graphql"
);

const Create = ({ location: { state } }) => (
  <>
    <Box pt={5} px={5}>
      <Steps.List>
        <Steps.Item to="./" state={state}>
          <Trans>Fill in the form</Trans>
        </Steps.Item>
        <Steps.Item to="./confirm" state={state} disabled>
          <Trans>Confirm</Trans>
        </Steps.Item>
      </Steps.List>
    </Box>
    <Router>
      <CreationForm path="/" />
      <Confirmation path="/confirm" />
    </Router>
  </>
);

const CreationForm = ({ navigate, location, location: { state } }) => {
  const { createInnmDosage } = state || {};
  return (
    <Box p={5}>
      <Heading as="h1" fontWeight="normal" mb={5}>
        <Trans>Create INNM Dosage</Trans>
      </Heading>
      <Form
        onSubmit={({ ingredients, ...data }) => {
          const completedIngredients = ingredients.map(
            ({ isPrimary, dosage, ...ingredientsData }) => ({
              ...ingredientsData,
              isPrimary: !!isPrimary,
              dosage: {
                ...dosage,
                numeratorValue: parseInt(dosage.numeratorValue),
                denumeratorValue: 1
              }
            })
          );
          navigate("./confirm", {
            state: {
              createInnmDosage: { ...data, ingredients: completedIngredients }
            }
          });
        }}
        initialValues={
          createInnmDosage || {
            ingredients: [
              {
                isPrimary: true
              }
            ]
          }
        }
      >
        <Flex>
          <Box pr={2} width={2 / 5}>
            <Trans
              id="Enter name"
              render={({ translation }) => (
                <Field.Text
                  name="name"
                  label={<Trans>Name</Trans>}
                  placeholder={translation}
                />
              )}
            />
            <Validation.Required field="name" message="Required field" />
          </Box>
          <Box width={2 / 5}>
            <Composer
              components={[
                <DictionaryValue name="MEDICATION_FORM" />,
                ({ render }) => <Trans id="Select option" render={render} />
              ]}
            >
              {([dict, { translation }]) => (
                <Field.Select
                  name="form"
                  label={<Trans>Form</Trans>}
                  placeholder={translation}
                  items={Object.keys(dict)}
                  itemToString={item => dict[item] || translation}
                  variant="select"
                  emptyOption
                />
              )}
            </Composer>
            <Validation.Required field="form" message="Required field" />
          </Box>
        </Flex>
        <Line />
        <Field.Array
          name="ingredients"
          addText={<Trans>Add additional ingredient</Trans>}
          removeText={<Trans>Delete</Trans>}
          fields={Ingredients}
        />
        <Flex mb={100}>
          <Box mr={3}>
            <Button
              type="reset"
              variant="blue"
              width={140}
              onClick={() => navigate("../search")}
            >
              <Trans>Back</Trans>
            </Button>
          </Box>
          <Box>
            <Button variant="green" width={140}>
              <Trans>Add</Trans>
            </Button>
          </Box>
        </Flex>
      </Form>
    </Box>
  );
};

const Ingredients = ({ name, index }) => (
  <>
    <IngredientsHeader index={index} />
    <Flex mx={-1}>
      <Box px={1} width={2.5 / 7}>
        <Query
          query={SearchINNMsQuery}
          fetchPolicy="cache-first"
          variables={{
            skip: true
          }}
        >
          {({
            loading,
            error,
            data: { innms: { nodes: innms = [] } = {} } = {},
            refetch: refetchINNMs
          }) => (
            <>
              <I18n>
                {({ i18n }) => (
                  <Field.Select
                    name={`${name}.innm`}
                    label={<Trans>Ingredient name</Trans>}
                    placeholder={i18n._(t`Enter ingredient name`)}
                    items={innms.map(({ id, name }) => ({ innmId: id, name }))}
                    itemToString={item => item && item.name}
                    filter={innms => innms}
                    onInputValueChange={debounce(
                      (name, { selectedItem, inputValue }) =>
                        !isEmpty(name) &&
                        (selectedItem && selectedItem.name) !== inputValue &&
                        refetchINNMs({
                          skip: false,
                          first: 20,
                          filter: { name, isActive: true }
                        }),
                      1000
                    )}
                  />
                )}
              </I18n>
              <Validations field={`${name}.innm`}>
                <Validation.Required message="Required field" />
                <Validation.Custom
                  options={({ value, allValues: { ingredients } }) => {
                    const filteredIngredients = ingredients.filter(
                      ({ innm } = {}) => {
                        const { innmId: allValuesId } = innm || {};
                        const { innmId: valueId } = value || {};
                        return valueId === allValuesId;
                      }
                    );
                    return filteredIngredients.length === 1;
                  }}
                  message="This ingredient is used more than once"
                />
              </Validations>
            </>
          )}
        </Query>
      </Box>
      <Box px={1} width={1.5 / 7}>
        <Field.Number
          name={`${name}.dosage.numeratorValue`}
          label={<Trans>Amount</Trans>}
          placeholder="0 - 1 000"
        />
        <Validation.Required
          field={`${name}.dosage.numeratorValue`}
          message="Required field"
        />
      </Box>

      <Box px={1} width={1.5 / 7}>
        <Composer
          components={[<DictionaryValue name="MEDICATION_UNIT" />, <I18n />]}
        >
          {([dict, { i18n }]) => {
            const translation = i18n._(t`Select option`);
            return (
              <Field.Select
                name={`${name}.dosage.numeratorUnit`}
                label={<Trans>Units</Trans>}
                placeholder={translation}
                items={Object.keys(dict)}
                itemToString={item => dict[item] || translation}
                variant="select"
                emptyOption
              />
            );
          }}
        </Composer>
        <Validation.Required
          field={`${name}.dosage.numeratorUnit`}
          message="Required field"
        />
      </Box>
      <Box px={1} width={1.5 / 7}>
        <Composer
          components={[<DictionaryValue name="MEDICATION_UNIT" />, <I18n />]}
        >
          {([dict, { i18n }]) => {
            const translation = i18n._(t`Select option`);
            return (
              <Field.Select
                name={`${name}.dosage.denumeratorUnit`}
                label={<Trans>By one</Trans>}
                placeholder={translation}
                items={Object.keys(dict)}
                itemToString={item => dict[item] || translation}
                variant="select"
                emptyOption
              />
            );
          }}
        </Composer>
        <Validation.Required
          field={`${name}.dosage.denumeratorUnit`}
          message="Required field"
        />
      </Box>
    </Flex>
  </>
);

const Confirmation = ({ navigate, location: { state } }) => {
  if (!state) return null;
  const {
    createInnmDosage,
    createInnmDosage: { name, form, ingredients } = {}
  } = state;
  return (
    <Box p={5}>
      <DefinitionListView
        labels={{
          name: <Trans>INNM dosage name</Trans>,
          form: <Trans>Form</Trans>
        }}
        data={{
          name,
          form: <DictionaryValue name="MEDICATION_FORM" item={form} />
        }}
        labelWidth="200px"
      />
      <Line />
      {ingredients.map(
        (
          {
            innm: { name },
            dosage: {
              numeratorValue,
              numeratorUnit,
              denumeratorValue,
              denumeratorUnit
            }
          },
          index
        ) => (
          <Box key={index}>
            <IngredientsHeader index={index} />
            <DefinitionListView
              labels={{
                innm: <Trans>Ingredient name</Trans>,
                dosages: <Trans>Dosage</Trans>
              }}
              data={{
                innm: name,
                dosages: (
                  <>
                    {denumeratorValue}{" "}
                    <DictionaryValue
                      name="MEDICATION_UNIT"
                      item={denumeratorUnit}
                    />{" "}
                    <Trans>includes</Trans> {numeratorValue}{" "}
                    <DictionaryValue
                      name="MEDICATION_UNIT"
                      item={numeratorUnit}
                    />
                  </>
                )
              }}
              labelWidth="200px"
            />
            <Line />
          </Box>
        )
      )}
      <Flex mt={5}>
        <Box mr={3}>
          <Button
            variant="blue"
            width={140}
            onClick={() => {
              navigate("../", {
                state: {
                  createInnmDosage
                }
              });
            }}
          >
            <Trans>Back</Trans>
          </Button>
        </Box>
        <Box>
          <Mutation mutation={CreateINNMDosageMutation}>
            {createInnmDosage => (
              <Button
                variant="green"
                width={140}
                onClick={async () => {
                  const completedIngredients = ingredients.map(
                    ({ innm: { innmId }, ...data }) => ({
                      ...data,
                      innmId
                    })
                  );
                  await createInnmDosage({
                    variables: {
                      input: {
                        name,
                        form,
                        ingredients: completedIngredients
                      }
                    }
                  });
                  await navigate("../../search");
                }}
              >
                <Trans>Add</Trans>
              </Button>
            )}
          </Mutation>
        </Box>
      </Flex>
    </Box>
  );
};

const IngredientsHeader = ({ index }) => (
  <Text fontSize={2} mb={6}>
    {index ? (
      <Trans>Additional ingredient</Trans>
    ) : (
      <Trans>Main ingredient</Trans>
    )}
  </Text>
);

export default Create;

const AddButton = system(
  {
    fontSize: 0,
    color: "rockmanBlue"
  },
  {
    display: "inline-block",
    verticalAlign: "middle",
    userSelect: "none",
    outline: "none",
    textDecoration: "none",
    cursor: "pointer",
    fontWeight: "bold"
  },
  "fontSize",
  "color"
);
