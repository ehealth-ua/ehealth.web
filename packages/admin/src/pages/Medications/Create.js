import React from "react";
import { I18n } from "@lingui/react";
import isEmpty from "lodash/isEmpty";
import Composer from "react-composer";
import debounce from "lodash/debounce";
import { loader } from "graphql.macro";
import { Router } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import createDecorator from "final-form-calculate";
import { Trans, t, DateFormat } from "@lingui/macro";
import { Heading, Flex, Box, Text } from "@rebass/emotion";
import { Form, Validation, Validations } from "@ehealth/components";

import Line from "../../components/Line";
import Steps from "../../components/Steps";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import DictionaryValue from "../../components/DictionaryValue";
import DefinitionListView from "../../components/DefinitionListView";

const SearchINNMDosagesQuery = loader(
  "../../graphql/SearchINNMDosagesQuery.graphql"
);
const CreateMedicationMutation = loader(
  "../../graphql/CreateMedicationMutation.graphql"
);

const Create = ({ location: { state } }) => (
  <>
    <Box pt={5} px={5}>
      <Steps.List>
        <Steps.Item to="./" state={state}>
          <Trans>General info</Trans>
        </Steps.Item>
        <Steps.Item to="./ingredients" state={state}>
          <Trans>Ingredients</Trans>
        </Steps.Item>
        <Steps.Item to="./registration" state={state}>
          <Trans>Registration</Trans>
        </Steps.Item>
        <Steps.Item to="./confirm" state={state} disabled>
          <Trans>Confirm</Trans>
        </Steps.Item>
      </Steps.List>
    </Box>
    <Router>
      <GeneralForm path="/" />
      <IngredientsForm path="/ingredients" />
      <RegistrationForm path="/registration" />
      <Confirmation path="/confirm" />
    </Router>
  </>
);

const GeneralForm = ({ navigate, location, location: { state } }) => {
  const { createMedicationGeneral } = state || {};
  return (
    <Box p={5}>
      <Heading as="h1" fontWeight="normal" mb={5}>
        <Trans>Create medication</Trans>
      </Heading>
      <Form
        onSubmit={({ dailyDosage, ...data }) => {
          navigate("./ingredients", {
            state: {
              ...state,
              createMedicationGeneral: {
                ...data,
                dailyDosage: parseInt(dailyDosage)
              }
            }
          });
        }}
        initialValues={
          createMedicationGeneral || {
            atcCodes: [""]
          }
        }
      >
        <Box width={2 / 5}>
          <Trans
            id="Enter medication name"
            render={({ translation }) => (
              <Field.Text
                name="name"
                label={<Trans>Medication name</Trans>}
                placeholder={translation}
              />
            )}
          />
          <Validation.Required field="name" message="Required field" />
        </Box>
        <Field.Array
          name="atcCodes"
          addText={<Trans>Add ATC Code</Trans>}
          removeText={<Trans>Delete</Trans>}
          fields={AtcCodes}
        />
        <Line />
        <Box width={1 / 4}>
          <Composer
            components={[<DictionaryValue name="MEDICATION_FORM" />, <I18n />]}
          >
            {([dict, { i18n }]) => {
              const translation = i18n._(t`Select option`);
              return (
                <Field.Select
                  name="form"
                  label={<Trans>Form</Trans>}
                  placeholder={translation}
                  items={Object.keys(dict)}
                  itemToString={item => dict[item] || translation}
                  variant="select"
                  emptyOption
                />
              );
            }}
          </Composer>
          <Validation.Required field="form" message="Required field" />
        </Box>
        <Box width={1 / 4}>
          <Field.Number
            name="dailyDosage"
            label={<Trans>Daily dosage</Trans>}
            placeholder="0 - 999"
            postfix={<Trans>mg</Trans>}
          />
          <Validation.Required field="dailyDosage" message="Required field" />
        </Box>
        <Flex pt={5} mb={100}>
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
              <Trans>Next</Trans>
            </Button>
          </Box>
        </Flex>
      </Form>
    </Box>
  );
};

const IngredientsForm = ({ navigate, location, location: { state } }) => {
  const { createMedicationIngredients } = state || {};
  return (
    <Box p={5} pb={100}>
      <Heading as="h1" fontWeight="normal" mb={5}>
        <Trans>Ingredients</Trans>
      </Heading>
      <Form
        onSubmit={({
          ingredients,
          container: { numeratorValue, ...container },
          packageQty,
          packageMinQty,
          ...data
        }) => {
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
          navigate("../registration", {
            state: {
              ...state,
              createMedicationIngredients: {
                ...data,
                ingredients: completedIngredients,
                container: {
                  ...container,
                  denumeratorValue: 1,
                  numeratorValue: parseInt(numeratorValue)
                },
                packageMinQty: parseInt(packageMinQty),
                packageQty: parseInt(packageQty)
              }
            }
          });
        }}
        initialValues={
          createMedicationIngredients || {
            ingredients: [
              {
                isPrimary: true
              }
            ]
          }
        }
        decorators={[unitDecorator]}
      >
        <Field.Array
          name="ingredients"
          addText={<Trans>Add additional ingredient</Trans>}
          removeText={<Trans>Delete</Trans>}
          fields={Ingredients}
        />
        <Line />
        <Heading as="h1" fontWeight="normal" mb={5}>
          <Trans>Package</Trans>
        </Heading>
        <Text fontSize={2} mb={6}>
          <Trans>Container</Trans>
        </Text>
        <Flex mx={-1}>
          <Box px={1} width={2 / 7}>
            <Composer
              components={[
                <DictionaryValue name="MEDICATION_UNIT" />,
                <I18n />
              ]}
            >
              {([dict, { i18n }]) => {
                const translation = i18n._(t`Select option`);
                return (
                  <Field.Select
                    name="container.denumeratorUnit"
                    label={<Trans>Type</Trans>}
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
              field="container.denumeratorUnit"
              message="Required field"
            />
          </Box>
          <Box px={1} width={2 / 7}>
            <Field.Number
              name="container.numeratorValue"
              label={<Trans>Amount</Trans>}
              placeholder="0 - 1 000"
            />
            <Validation.Required
              field="container.numeratorValue"
              message="Required field"
            />
          </Box>
          <Box px={1} width={2 / 7}>
            <Composer
              components={[
                <DictionaryValue name="MEDICATION_UNIT" />,
                <I18n />
              ]}
            >
              {([dict, { i18n }]) => {
                const translation = i18n._(t`Select option`);
                return (
                  <Field.Select
                    name="container.numeratorUnit"
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
              field="container.numeratorUnit"
              message="Required field"
            />
          </Box>
        </Flex>
        <Flex mx={-1}>
          <Box px={1} width={2 / 7}>
            <Field.Number
              name="packageQty"
              label={<Trans>Package quantity</Trans>}
              placeholder="0 - 1 000"
            />
            <Validation.Required field="packageQty" message="Required field" />
          </Box>
          <Box px={1} width={2 / 7}>
            <Field.Number
              name="packageMinQty"
              label={<Trans>Package minimum quantity</Trans>}
              placeholder="0 - 1 000"
            />
            <Validation.Required
              field="packageMinQty"
              message="Required field"
            />
          </Box>
        </Flex>
        <Flex pt={5}>
          <Box mr={3}>
            <Button
              type="reset"
              variant="blue"
              width={140}
              onClick={() => {
                navigate("../", {
                  state
                });
              }}
            >
              <Trans>Back</Trans>
            </Button>
          </Box>
          <Box>
            <Button variant="green" width={140}>
              <Trans>Next</Trans>
            </Button>
          </Box>
        </Flex>
      </Form>
    </Box>
  );
};

const RegistrationForm = ({ navigate, location, location: { state } }) => {
  const { createMedicationRegistration } = state || {};
  return (
    <Box p={5} pb={250}>
      <Heading as="h1" fontWeight="normal" mb={5}>
        <Trans>Manufacturer country</Trans>
      </Heading>
      <Form
        onSubmit={data => {
          navigate("../confirm", {
            state: {
              ...state,
              createMedicationRegistration: data
            }
          });
        }}
        initialValues={createMedicationRegistration}
      >
        <Box width={1 / 3}>
          <Composer components={[<DictionaryValue name="COUNTRY" />, <I18n />]}>
            {([dict, { i18n }]) => {
              const translation = i18n._(t`Select option`);
              return (
                <Field.Select
                  name="manufacturer.country"
                  label={<Trans>Country</Trans>}
                  placeholder={translation}
                  items={Object.keys(dict)}
                  filterOptions={{ keys: [item => dict[item]] }}
                  itemToString={item => dict[item]}
                />
              );
            }}
          </Composer>
          <Validation.Required
            field="manufacturer.country"
            message="Required field"
          />
        </Box>
        <Box width={1 / 3}>
          <Trans
            id="Enter manufacturer"
            render={({ translation }) => (
              <Field.Text
                name="manufacturer.name"
                label={<Trans>Manufacturer</Trans>}
                placeholder={translation}
              />
            )}
          />
          <Validation.Required
            field="manufacturer.name"
            message="Required field"
          />
        </Box>
        <Line />
        <Heading as="h1" fontWeight="normal" mb={5}>
          <Trans>Certificate</Trans>
        </Heading>
        <Box width={1 / 3}>
          <Trans
            id="Enter certificate number"
            render={({ translation }) => (
              <Field.Text
                name="certificate"
                label={<Trans>Certificate number</Trans>}
                placeholder={translation}
              />
            )}
          />
          <Validation.Required field="certificate" message="Required field" />
        </Box>
        <Box width={1 / 3}>
          <Field.DatePicker
            name="certificateExpiredAt"
            label={<Trans>Certificate expired at</Trans>}
            minDate="1900-01-01"
          />
          <Validation.Required
            field="certificateExpiredAt"
            message="Required field"
          />
        </Box>
        <Flex pt={5}>
          <Box mr={3}>
            <Button
              type="reset"
              variant="blue"
              width={140}
              onClick={() => {
                navigate("../ingredients", {
                  state
                });
              }}
            >
              <Trans>Back</Trans>
            </Button>
          </Box>
          <Box>
            <Button variant="green" width={140}>
              <Trans>Next</Trans>
            </Button>
          </Box>
        </Flex>
      </Form>
    </Box>
  );
};

const Confirmation = ({ navigate, location: { state } }) => {
  const {
    createMedicationGeneral,
    createMedicationIngredients,
    createMedicationRegistration
  } = state || {};

  if (
    !createMedicationGeneral ||
    !createMedicationIngredients ||
    !createMedicationRegistration
  )
    return null;

  const { atcCodes, dailyDosage, form, name } = createMedicationGeneral;
  const {
    ingredients,
    container: {
      numeratorValue,
      numeratorUnit,
      denumeratorValue,
      denumeratorUnit
    },
    packageMinQty,
    packageQty
  } = createMedicationIngredients;
  const {
    manufacturer,
    certificate,
    certificateExpiredAt
  } = createMedicationRegistration;

  return (
    <Box p={5}>
      <Heading as="h1" fontWeight="normal" mb={5}>
        <Trans>Confirmation</Trans>
      </Heading>
      <DefinitionListView
        labels={{
          name: <Trans>Medication name</Trans>,
          form: <Trans>Form</Trans>,
          dailyDosage: <Trans>Daily dosage</Trans>,
          atcCodes: <Trans>ATC Codes</Trans>
        }}
        data={{
          name,
          form: <DictionaryValue name="MEDICATION_FORM" item={form} />,
          dailyDosage,
          atcCodes: atcCodes.join(", ")
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
                name: <Trans>Ingredient name</Trans>,
                dosages: <Trans>Dosage</Trans>
              }}
              data={{
                name,
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
      <DefinitionListView
        labels={{
          container: <Trans>Package</Trans>,
          packageQty: <Trans>Package quantity</Trans>,
          packageMinQty: <Trans>Package minimum quantity</Trans>
        }}
        data={{
          container: (
            <>
              {denumeratorValue}{" "}
              <DictionaryValue name="MEDICATION_UNIT" item={denumeratorUnit} />{" "}
              <Trans>includes</Trans> {numeratorValue}{" "}
              <DictionaryValue name="MEDICATION_UNIT" item={numeratorUnit} />
            </>
          ),
          packageQty,
          packageMinQty
        }}
        labelWidth="200px"
      />
      <Line />
      <DefinitionListView
        labels={{
          country: <Trans>Country</Trans>,
          manufacturer: <Trans>Manufacturer</Trans>,
          certificate: <Trans>Certificate</Trans>,
          certificateExpiredAt: <Trans>Certificate expired at</Trans>
        }}
        data={{
          country: (
            <DictionaryValue name="COUNTRY" item={manufacturer.country} />
          ),
          manufacturer: manufacturer.name,
          certificate,
          certificateExpiredAt: <DateFormat value={certificateExpiredAt} />
        }}
        labelWidth="200px"
      />
      <Flex mt={5}>
        <Box mr={3}>
          <Button
            variant="blue"
            width={140}
            onClick={() => {
              navigate("../registration", {
                state
              });
            }}
          >
            <Trans>Back</Trans>
          </Button>
        </Box>
        <Box>
          <Mutation mutation={CreateMedicationMutation}>
            {createMedication => (
              <Button
                variant="green"
                width={140}
                onClick={async () => {
                  const completedIngredients = ingredients.map(
                    ({ innm: { innmDosageId }, ...data }) => ({
                      ...data,
                      innmDosageId
                    })
                  );
                  await createMedication({
                    variables: {
                      input: {
                        ...createMedicationGeneral,
                        ...createMedicationRegistration,
                        ...createMedicationIngredients,
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

const AtcCodes = ({ name, index }) => (
  <Box width={1 / 4}>
    <Field.Text
      name={name}
      label={<Trans>ATC Code</Trans>}
      placeholder="A01AD01"
    />
    <Validations field={name}>
      <Validation.Required message="Required field" />
      <Validation.Matches
        options="^[abcdghjlmnprsvABCDGHJLMNPRSV]{1}[0-9]{2}[a-zA-Z]{2}[0-9]{2}$"
        message="Invalid code"
      />
    </Validations>
  </Box>
);

const Ingredients = ({ name, index }) => (
  <>
    <IngredientsHeader index={index} />
    <Flex mx={-1}>
      <Box px={1} width={2.5 / 7}>
        <Query
          query={SearchINNMDosagesQuery}
          fetchPolicy="cache-first"
          variables={{
            skip: true
          }}
        >
          {({
            loading,
            error,
            data: { innmDosages: { nodes: innmDosages = [] } = {} } = {},
            refetch: refetchINNMDosages
          }) => (
            <I18n>
              {({ i18n }) => (
                <Field.Select
                  name={`${name}.innm`}
                  label={<Trans>Ingredient name</Trans>}
                  placeholder={i18n._(t`Enter ingredient name`)}
                  items={innmDosages.map(({ databaseId, name }) => ({
                    innmDosageId: databaseId,
                    name
                  }))}
                  itemToString={item => item && item.name}
                  filter={innmDosages => innmDosages}
                  onInputValueChange={debounce(
                    (name, { selectedItem, inputValue }) =>
                      !isEmpty(name) &&
                      (selectedItem && selectedItem.name) !== inputValue &&
                      refetchINNMDosages({
                        skip: false,
                        first: 20,
                        filter: { name }
                      }),
                    1000
                  )}
                />
              )}
            </I18n>
          )}
        </Query>
        <Validation.Required field={`${name}.innm`} message="Required field" />
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

const unitDecorator = createDecorator({
  field: "ingredients[0].dosage.denumeratorUnit",
  updates: {
    "container.numeratorUnit": value => {
      return value ? value : undefined;
    }
  }
});
