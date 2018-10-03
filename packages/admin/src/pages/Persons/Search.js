import React from "react";
import { Flex, Box, Heading } from "rebass/emotion";
import { Router, Redirect } from "@reach/router";
import { Query } from "react-apollo";
import format from "date-fns/format";
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
import { getIn } from "final-form";

import * as Field from "../../components/Field";
import SearchPersonsQuery from "../../graphql/SearchPersonsQuery.graphql";
import Details from "../../components/Details";
import Table from "../../components/Table";
import Link from "../../components/Link";

const PHONE_PATTERN = "^\\+380\\d{9}$";

const Search = ({ uri }) => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={1}>
      Пошук пацієнтів
    </Heading>
    <Tabs.Nav>
      <Tabs.Link to="./by-person-data">За даними</Tabs.Link>
      <Tabs.Link to="./by-declaration">За номером декларації</Tabs.Link>
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
            {({ loading, error, data: { persons = [] } }) =>
              !error && persons.length > 0 ? (
                <Table
                  data={persons}
                  header={{
                    fullName: "ПІБ пацієнта",
                    birthDate: "Дата народження",
                    taxId: "ІПН",
                    unzr: "ID запису в ЄДР",
                    authenticationMethods: "Метод аутентифікації",
                    insertedAt: "Додано",
                    action: "Дія"
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
                    insertedAt: format(
                      new Date(insertedAt),
                      "DD.MM.YYYY, HH:mm"
                    ),
                    authenticationMethods: (
                      <AuthnMethodsList data={authenticationMethods} />
                    ),
                    action: (
                      <Link to={`../${id}`} fontWeight="bold">
                        Показати деталі
                      </Link>
                    )
                  })}
                  sortableFields={["birthDate", "taxId", "unzr", "insertedAt"]}
                  sortingParams={parseSortingParams(locationParams.orderBy)}
                  onSortingChange={sortingParams =>
                    setLocationParams({
                      orderBy: stringifySortingParams(sortingParams)
                    })
                  }
                  tableName="persons/search"
                />
              ) : null
            }
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
        <Field.Text
          name="filter.personal.firstName"
          label="Прізвище"
          placeholder="Введіть прізвище"
        />
        <Validation
          field="filter.personal.firstName"
          validate={validateRequiredObjectField("filter.personal")}
          message="Обов&#700;язкове поле"
        />
      </Box>
      <Box px={1} width={1 / 3}>
        <Field.Text
          name="filter.personal.lastName"
          label="Ім’я"
          placeholder="Введіть ім’я"
        />
        <Validation
          field="filter.personal.lastName"
          validate={validateRequiredObjectField("filter.personal")}
          message="Обов&#700;язкове поле"
        />
      </Box>
      <Box px={1} width={1 / 6}>
        <Field.DatePicker
          name="filter.personal.birthDate"
          label="Дата народження"
        />
        <Validation
          field="filter.personal.birthDate"
          validate={validateRequiredObjectField("filter.personal")}
          message="Обов&#700;язкове поле"
        />
      </Box>
    </Flex>
    <Details summary="розширений пошук">
      <Box fontSize={0} pb={2}>
        Для пошуку, заповніть будь-яке з наведених полів
      </Box>
      <Flex mx={-1}>
        <Box px={1} width={1 / 3} borderLeft="1">
          <Field.Text
            name="filter.unzr"
            label="ID Запису в ЄДР"
            placeholder="МЕ123456"
            format={formatUnzr}
            divider
          />
        </Box>
        <Box px={1} width={1 / 3} borderLeft="1">
          <Field.Text
            name="filter.taxId"
            label="ІНН"
            placeholder="123456789"
            divider
          />
        </Box>
        <Box px={1} width={1 / 3}>
          <Field.Text
            name="filter.phoneNumber"
            label="Номер телефону"
            placeholder="+38"
            format={formatPhone}
            parse={parsePhone}
          />
          <Validation.Matches
            field="filter.phoneNumber"
            options={PHONE_PATTERN}
            message="Невірний номер телефону"
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
        <Field.Text
          name="filter.declarationNumber"
          label="Пошук за номером декларації"
          placeholder="Введіть номер декларації"
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
