import React, { Component } from "react";
import debounce from "lodash/debounce";
import subYears from "date-fns/sub_years";
import {
  Connect,
  Field,
  Form,
  Validation,
  Validations
} from "@ehealth/components";
import { formatDate, parseDate } from "@ehealth/utils";
import DigitalSignature from "@ehealth/react-iit-digital-signature";

import { REACT_APP_API_URL } from "../../../env";
import { createUrl } from "../../../helpers/url";
import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import { H1, H2 } from "../../../components/Title";

const NAME_PATTERN =
  '^(?!.*[ЫЪЭЁыъэё@%&$^#])[a-zA-ZА-ЯҐЇІЄа-яґїіє0-9№\\"!\\^\\*)\\]\\[(._-].*$';
const PERSON_NAME_PATTERN = "^(?!.*[ЫЪЭЁыъэё@%&$^#])[А-ЯҐЇІЄа-яґїіє\\'\\- ]*$";
const BUILDING_PATTERN =
  "^[1-9]((?![ЫЪЭЁыъэё])()([А-ЯҐЇІЄа-яґїіє \\/\\'\\-0-9])){0,20}$";

const SignUpPersonPage = ({ location }) => (
  <Main>
    <Header>
      <H1>Авторизація в системі</H1>
    </Header>
    <Article>
      <UserInfo />
      <H2>Для продовження, додайте персональні дані</H2>
      <NarrowContainer>
        <Field.Input
          name="person.last_name"
          label="Прізвище"
          color="#292929"
          disabled
        />
        <Field.Input
          name="person.first_name"
          label="Ім'я"
          placeholder="Введіть ім'я"
        />
        <Validations field="person.first_name">
          <Validation.Required message="Об'язкове поле" />
          <Validation.Matches
            options={PERSON_NAME_PATTERN}
            message="Дозволені тільки літери українського алфавіту"
          />

          <DigitalSignatureValidation
            validate={(ds, value) =>
              ds.privKeySubject.GivenName.toUpperCase().includes(
                value && value.toUpperCase()
              )
            }
            message="Має збігатися з цифровим підписом"
          />
        </Validations>
        <Field.Input
          name="person.second_name"
          label="По-батькові"
          placeholder="Введіть по-батькові"
        />
        <Validation.Matches
          field="person.second_name"
          options={PERSON_NAME_PATTERN}
          message="Дозволені тільки літери українського алфавіту"
        />
        <Field.Input
          name="person.birth_country"
          placeholder="Введіть країну народження"
          label="Країна народження"
        />
        <Validation.Required
          field="person.birth_country"
          message="Об'язкове поле"
        />
        <Field.Input
          name="person.birth_settlement"
          placeholder="Введіть місто народження"
          label="Місто народження"
        />
        <Validations field="person.birth_settlement">
          <Validation.Required message="Об'язкове поле" />
          <Validation.Matches
            options={NAME_PATTERN}
            message="Дозволені тільки цифри та літери українського й англійського алфавіту"
          />
        </Validations>
        <Field.Input
          label="Дата народження"
          name="person.birth_date"
          placeholder="ДД.ММ.РРРР"
          format={formatDate}
          parse={parseDate}
          horizontal
        />
        <Validations field="person.birth_date">
          <Validation.Required message="Об'язкове поле" />
          <Validation.Date message="Невірна дата" />
          <Validation.After
            options={subYears(new Date(), 100).toISOString()}
            message="Невірна дата"
          />
        </Validations>
        <Connect
          mapStateToProps={state => ({
            documentTypes: Object.entries(
              state.data.dictionaries.DOCUMENT_TYPE.values
            )
          })}
        >
          {({ documentTypes }) => (
            <Field.Select
              name="local.document.type"
              label="Документ"
              placeholder="Тип документу"
              format={value =>
                documentTypes.find(([key]) => key === value) || null
              }
              parse={item => (item == null ? undefined : item[0])}
              itemToString={item => (item == null ? "" : item[1])}
              renderItem={item => item[1]}
              items={documentTypes}
            />
          )}
        </Connect>
        <Validation.Required
          field="local.document.type"
          message="Об'язкове поле"
        />
        <Field.Row>
          <Field.Col width={1 / 3}>
            <Field.Input name="local.document.series" placeholder="Серія" />
          </Field.Col>
          <Field.Col width={2 / 3}>
            <Field.Input name="local.document.number" placeholder="Номер" />
            <Validation.Required
              field="local.document.number"
              message="Об'язкове поле"
            />
          </Field.Col>
        </Field.Row>
        <Field.Input
          name="local.document.issued_by"
          placeholder="Ким виданий"
        />
        <Field.Input
          name="local.document.issued_at"
          placeholder="Дата видачі"
          format={formatDate}
          parse={parseDate}
        />
        <Validation.Date
          field="local.document.issued_at"
          message="Невірна дата"
        />
        <Field.Group label="Стать">
          <Field.Row>
            <Field.Col width={1 / 3}>
              <Field.Radio name="person.gender" label="Жіноча" value="FEMALE" />
            </Field.Col>
            <Field.Col width={1 / 3}>
              <Field.Radio name="person.gender" label="Чоловіча" value="MALE" />
            </Field.Col>
          </Field.Row>
        </Field.Group>
        <Validation.Required field="person.gender" message="Об'язкове поле" />
        <AddressFields type="REGISTRATION" label="Адреса реєстрації" />
        <Field.Checkbox
          label="Співпадає з місцем проживання"
          name="local.residenceAddressMatchesRegistration"
        />
        <Field
          name="local.residenceAddressMatchesRegistration"
          subscription={{ value: true }}
        >
          {({ input: { value } }) =>
            value || (
              <AddressFields type="RESIDENCE" label="Адреса проживання" />
            )
          }
        </Field>

        <Form.Submit block>Далі</Form.Submit>
      </NarrowContainer>
    </Article>
  </Main>
);

export default SignUpPersonPage;

const UserInfo = () => (
  <Field name="person.email" subscription={{ value: true }}>
    {({ input: { value: email } }) => (
      <DigitalSignature.Consumer>
        {({ ds: { privKeyOwnerInfo } }) => (
          <p>
            {email}
            <br />
            ІПН: {privKeyOwnerInfo.subjDRFOCode}
          </p>
        )}
      </DigitalSignature.Consumer>
    )}
  </Field>
);

const DigitalSignatureValidation = ({ validate, ...props }) => (
  <DigitalSignature.Consumer>
    {({ keyAvailable, ds }) =>
      keyAvailable && (
        <Validation
          {...props}
          validate={(value, allValues) => validate(ds, value, allValues)}
        />
      )
    }
  </DigitalSignature.Consumer>
);

class AddressFields extends Component {
  state = {
    loaded: false,
    regions: [],
    settlements: []
  };

  async componentDidMount() {
    const regionsResponse = await fetch(
      createUrl(`${REACT_APP_API_URL}/api/uaddresses/regions`, {
        page_size: 30
      })
    );
    const { data: regions } = await regionsResponse.json();
    this.setState({ regions, loaded: true });
  }

  fetchSettlementsDebounced = debounce(this.fetchSettlementsSearch, 500);

  async fetchSettlementsSearch({ settlement, area }) {
    if (settlement.length < 2) {
      this.setState({ settlements: [] });
    } else {
      const settlementsResponse = await fetch(
        createUrl(`${REACT_APP_API_URL}/api/uaddresses/search/settlements`, {
          name: settlement,
          page_size: 200,
          region: area
        })
      );
      const { data } = await settlementsResponse.json();
      this.setState({ settlements: data });
    }
  }

  render() {
    const { type, label } = this.props;
    const { regions, settlements, loaded } = this.state;

    if (!loaded) return null;

    return (
      <Field.Group label={label}>
        <Field.Select
          name={`local.addresses[${type}].area`}
          placeholder="Область"
          items={regions
            .map(({ name }) => name)
            .sort((a, b) =>
              a.replace(/м\./i, "").localeCompare(b.replace(/м\./i, ""))
            )}
          filterItems={(inputValue, item) =>
            item.toLowerCase().includes(inputValue.toLowerCase())
          }
        />
        <Validation.Required
          field={`local.addresses[${type}].area`}
          message="Об'язкове поле"
        />
        <Connect
          mapStateToProps={state => ({
            settlementTypes: state.data.dictionaries.SETTLEMENT_TYPE.values
          })}
        >
          {({ settlementTypes }) => (
            <Field
              name={`local.addresses[${type}].area`}
              subscription={{ value: true }}
            >
              {({ input: { value: area } }) => (
                <Field.Select
                  name={`local.addresses[${type}].settlement`}
                  disabled={!area}
                  placeholder="Назва населеного пункту"
                  itemToString={item => (item === null ? "" : item.settlement)}
                  items={settlements.map(({ name, district, id, type }) => ({
                    settlement: name,
                    settlement_type: type,
                    settlement_id: id,
                    region: district || undefined
                  }))}
                  onInputValueChange={settlement =>
                    settlement &&
                    this.fetchSettlementsDebounced({ settlement, area })
                  }
                  renderItem={({ settlement_type, settlement, region }) => (
                    <>
                      <small>{settlementTypes[settlement_type]}</small>{" "}
                      {settlement}
                      {region && (
                        <>
                          {", "}
                          <small>район: {region}</small>
                        </>
                      )}
                    </>
                  )}
                />
              )}
            </Field>
          )}
        </Connect>
        <Validation.Required
          field={`local.addresses[${type}].settlement`}
          message="Об'язкове поле"
        />
        <Field.Input
          name={`local.addresses[${type}].zip`}
          placeholder="Індекс"
        />
        <Validations field={`local.addresses[${type}].zip`}>
          <Validation.Matches
            options={/^\d*$/}
            message="Дозволені тільки цифри"
          />
          <Validation.Length
            options={{ min: 5, max: 5 }}
            message="Довжина становить 5 символів"
          />
        </Validations>
        <Field.Row>
          <Field.Col width={1 / 2}>
            <Connect
              mapStateToProps={state => ({
                streetTypes: Object.entries(
                  state.data.dictionaries.STREET_TYPE.values
                )
              })}
            >
              {({ streetTypes }) => (
                <Field.Select
                  name={`local.addresses[${type}].street_type`}
                  placeholder="Тип вулиці"
                  format={value =>
                    streetTypes.find(([key]) => key === value) || null
                  }
                  parse={item => (item == null ? undefined : item[0])}
                  itemToString={item => (item == null ? "" : item[1])}
                  renderItem={item => item[1]}
                  items={streetTypes}
                />
              )}
            </Connect>
          </Field.Col>
          <Field.Col width={1 / 2}>
            <Field.Input
              name={`local.addresses[${type}].street`}
              placeholder="Назва вулиці"
            />
            <Validation.Matches
              field={`local.addresses[${type}].street`}
              options={NAME_PATTERN}
              message="Дозволені тільки цифри та літери українського й англійського алфавіту"
            />
          </Field.Col>
        </Field.Row>
        <Field.Row>
          <Field.Col width={1 / 2}>
            <Field.Input
              name={`local.addresses[${type}].building`}
              placeholder="№ буд."
            />
            <Validations field={`local.addresses[${type}].building`}>
              <Validation.Required message="Об'язкове поле" />
              <Validation.Matches
                options={BUILDING_PATTERN}
                message="Невірний формат"
              />
            </Validations>
          </Field.Col>
          <Field.Col width={1 / 2}>
            <Field.Input
              name={`local.addresses[${type}].apartment`}
              placeholder="№ квартири"
            />
          </Field.Col>
        </Field.Row>
      </Field.Group>
    );
  }
}
