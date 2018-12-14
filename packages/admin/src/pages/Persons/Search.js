import React from "react";
import { Flex, Box, Heading } from "rebass/emotion";
import { Router, Redirect } from "@reach/router";
import { Query } from "react-apollo";
import { getIn } from "final-form";
import { loader } from "graphql.macro";
import { Trans, DateFormat } from "@lingui/macro";
import { Form, Validation, Tabs, LocationParams } from "@ehealth/components";
import {
  parseSortingParams,
  stringifySortingParams,
  formatPhone,
  formatUnzr,
  parsePhone,
  getFullName,
  formatDate
} from "@ehealth/utils";

import Link from "../../components/Link";
import LoadingOverlay from "../../components/LoadingOverlay";
import Table from "../../components/Table";
import Details from "../../components/Details";
import * as Field from "../../components/Field";

const SearchPersonsQuery = loader("../../graphql/SearchPersonsQuery.graphql");

const PHONE_PATTERN = "^\\+380\\d{9}$";

const Search = ({ uri }) => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={1}>
      <Trans>Пошук пацієнтів</Trans>
    </Heading>
    <Tabs.Nav>
      <Tabs.Link to="./by-person-data">
        <Trans>За даними</Trans>
      </Tabs.Link>
      <Tabs.Link to="./by-declaration">
        <Trans>За номером декларації</Trans>
      </Tabs.Link>
    </Tabs.Nav>
    <LocationParams>
      {({ locationParams, setLocationParams }) => (
        <>
          <Router>
            <Redirect from="/" to={`${uri}/by-person-data`} />
            <SearchByPersonDataForm
              path="by-person-data"
              initialValues={locationParams}
              onSubmit={setLocationParams}
            />
            <SearchByDeclarationForm
              path="by-declaration"
              initialValues={locationParams}
              onSubmit={setLocationParams}
            />
          </Router>
          <Query query={SearchPersonsQuery} variables={locationParams}>
            {({
              loading,
              error,
              data: { persons = ({ nodes: persons = [] } = {}) } = {},
              refetch
            }) => {
              if (error) return `Error! ${error.message}`;
              return (
                <LoadingOverlay loading={loading}>
                  {persons.length > 0 ? (
                    <Table
                      data={persons}
                      header={{
                        fullName: <Trans>ПІБ пацієнта</Trans>,
                        birthDate: <Trans>Дата народження</Trans>,
                        taxId: <Trans>ІПН</Trans>,
                        unzr: <Trans>ID Запису в ЄДДР</Trans>,
                        authenticationMethods: (
                          <Trans>Метод аутентифікації</Trans>
                        ),
                        insertedAt: <Trans>Додано</Trans>,
                        action: <Trans>Дія</Trans>
                      }}
                      renderRow={({
                        id,
                        birthDate,
                        taxId,
                        authenticationMethods,
                        insertedAt,
                        ...person
                      }) => ({
                        ...person,
                        fullName: getFullName(person),
                        birthDate: formatDate(birthDate),
                        taxId: taxId || "—",
                        insertedAt: (
                          <DateFormat
                            value={insertedAt}
                            format={{
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric"
                            }}
                          />
                        ),
                        authenticationMethods: (
                          <AuthnMethodsList data={authenticationMethods} />
                        ),
                        action: (
                          <Link to={`../${id}`} fontWeight="bold">
                            <Trans>Показати деталі</Trans>
                          </Link>
                        )
                      })}
                      sortableFields={[
                        "birthDate",
                        "taxId",
                        "unzr",
                        "insertedAt"
                      ]}
                      sortingParams={parseSortingParams(locationParams.orderBy)}
                      onSortingChange={sortingParams =>
                        setLocationParams({
                          orderBy: stringifySortingParams(sortingParams)
                        })
                      }
                      tableName="persons/search"
                    />
                  ) : null}
                </LoadingOverlay>
              );
            }}
          </Query>
        </>
      )}
    </LocationParams>
  </Box>
);

export default Search;

const SearchByPersonDataForm = ({ initialValues, onSubmit }) => (
  <Form initialValues={initialValues} onSubmit={onSubmit}>
    <Flex mx={-1}>
      <Box px={1} width={1 / 3}>
        <Trans
          id="Введіть прізвище"
          render={({ translate }) => (
            <Field.Text
              name="filter.personal.firstName"
              label={<Trans>Прізвище</Trans>}
              placeholder={translate}
            />
          )}
        />
        <Validation
          field="filter.personal.firstName"
          validate={validateRequiredObjectField("filter.personal")}
          message={<Trans>Обовʼязкове поле</Trans>}
        />
      </Box>
      <Box px={1} width={1 / 3}>
        <Trans
          id="Введіть ім’я"
          render={({ translate }) => (
            <Field.Text
              name="filter.personal.lastName"
              label={<Trans>Ім’я</Trans>}
              placeholder={translate}
            />
          )}
        />
        <Validation
          field="filter.personal.lastName"
          validate={validateRequiredObjectField("filter.personal")}
          message={<Trans>Обовʼязкове поле</Trans>}
        />
      </Box>
      <Box px={1} width={1 / 6}>
        <Field.DatePicker
          name="filter.personal.birthDate"
          label={<Trans>Дата народження</Trans>}
        />
        <Validation
          field="filter.personal.birthDate"
          validate={validateRequiredObjectField("filter.personal")}
          message={<Trans>Обовʼязкове поле</Trans>}
        />
      </Box>
    </Flex>
    <Details summary="розширений пошук">
      <Box fontSize={0} pb={2}>
        <Trans>Для пошуку, заповніть будь-яке з наведених полів</Trans>
      </Box>
      <Flex mx={-1}>
        <Box px={1} width={1 / 3} borderLeft="1">
          <Trans
            id="19650930-65465"
            render={({ translate }) => (
              <Field.Text
                name="filter.unzr"
                label={<Trans>ID Запису в ЄДДР</Trans>}
                placeholder={translate}
                format={formatUnzr}
                divider
              />
            )}
          />
        </Box>
        <Box px={1} width={1 / 3} borderLeft="1">
          <Field.Text
            name="filter.taxId"
            label={<Trans>ІНН</Trans>}
            placeholder={123456789}
            divider
          />
        </Box>
        <Box px={1} width={1 / 3}>
          <Field.Text
            name="filter.phoneNumber"
            label={<Trans>Номер телефону</Trans>}
            placeholder={+38}
            format={formatPhone}
            parse={parsePhone}
          />
          <Validation.Matches
            field="filter.phoneNumber"
            options={PHONE_PATTERN}
            message={<Trans>Невірний номер телефону</Trans>}
          />
        </Box>
      </Flex>
    </Details>
    <input type="submit" hidden />
  </Form>
);

const validateRequiredObjectField = objectPath => (value, allValues) => {
  const object = getIn(allValues, objectPath) || {};
  return !(Object.values(object).some(v => v) && !value);
};

const SearchByDeclarationForm = ({ initialValues, onSubmit }) => (
  <Form initialValues={initialValues} onSubmit={onSubmit}>
    <Flex mx={-1}>
      <Box px={1} width={1 / 2}>
        <Trans
          id="Введіть номер декларації"
          render={({ translate }) => (
            <Field.Text
              name="filter.declarationNumber"
              label={<Trans>Пошук за номером декларації</Trans>}
              placeholder={translate}
            />
          )}
        />
      </Box>
    </Flex>
    <input type="submit" hidden />
  </Form>
);

const AuthnMethodsList = ({ data }) => (
  <Flex as="ul" flexDirection="column">
    {data.map(({ type, phoneNumber }, idx) => (
      <Box
        key={idx}
        as="li"
        mb={1}
        css={{ "&:last-child": { marginBottom: 0 } }}
      >
        {type !== "NA" ? (
          <>
            <div>{type}</div>
            {phoneNumber && <div>{phoneNumber}</div>}
          </>
        ) : (
          "—"
        )}
      </Box>
    ))}
  </Flex>
);
