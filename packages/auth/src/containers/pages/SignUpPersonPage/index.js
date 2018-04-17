import React, { Component } from "react";
import { Flex, Box } from "grid-emotion";
import { connect } from "react-redux";
import debounce from "lodash/debounce";
import { Field, Form, Validation, Button } from "@ehealth/components";

import { fetchDictionaries } from "../../../redux/dictionaries";
import { createUrl } from "../../../helpers/url";

const PersonFields = () => (
  <>
    <Field.Input
      name="second_name"
      placeholder="Введіть прізвище"
      label="Прізвище"
    />
    <Validation.Required field="second_name" message="Об'язкове поле" />
    <Field.Input name="first_name" label="Ім'я" placeholder="Введіть ім'я" />
    <Validation.Required field="first_name" message="Об'язкове поле" />

    <Field.Input
      name="last_name"
      label="По-батькові"
      placeholder="Введіть по-батькові"
    />
    <Validation.Required field="last_name" message="Об'язкове поле" />

    <Field.Input
      name="birth_country"
      placeholder="Введіть країну народження"
      label="Країна народження"
    />
    <Field.Input
      name="birth_settlement"
      placeholder="Введіть місто народження"
      label="Місто народження"
    />
    <Flex justifyContent="flex-start">
      <Box width={1 / 2}>Дата народження</Box>
      <Box width={1 / 2}>
        <Field.Input name="birth_date" />
      </Box>
    </Flex>

    <Flex justifyContent="space-between" alignItems="center">
      <Box width={2 / 7} display="inherit">
        <Field.Input name="documents.seria" placeholder="Серія" />
      </Box>
      <Box width={4 / 7} display="inherit">
        <Field.Input name="documents.number" placeholder="Номер" />
      </Box>
    </Flex>
    <Field.Input name="documents.issued_by" placeholder="Ким виданий" />
    <Field.Input name="documents.issued_at" placeholder="Дата видачі" />
    <Field.Group label="Стать">
      <Flex my={10}>
        <Box width={1 / 3}>
          <Field.Radio name="gender" label="Жіноча" value="female" />
        </Box>
        <Box width={1 / 3}>
          <Field.Radio name="gender" label="Чоловіча" value="male" />
        </Box>
      </Flex>
    </Field.Group>
    <Addresses index={0} type="REGISTRATION" />
    <div>
      <Field.Checkbox
        label="Співпадає з місцем проживання"
        name="same.address"
      />
    </div>
    <Field name="same.address" subscription={{ value: true }}>
      {({ input: { value: area } }) =>
        !area && <Addresses index={1} type="RESIDENCE" />
      }
    </Field>

    <Button block to="/sign-up/next/user">
      Далі
    </Button>
  </>
);

export default PersonFields;

class AddressComponent extends Component {
  state = {
    loaded: false,
    regions: [],
    settlements: []
  };
  async componentDidMount() {
    const regionsResponse = await fetch(
      createUrl("/api/uaddresses/regions", { page_size: 30 })
    );
    const { data: regions } = await regionsResponse.json();
    this.setState({ regions });

    await this.props.fetchDictionaries();
    this.setState({ loaded: true });
  }
  fetchSettlementsDebounced = debounce(this.fetchSettlementsSearch, 500);

  async fetchSettlementsSearch({ settlement, area }) {
    if (settlement.length < 2) {
      this.setState({ settlements: [] });
    } else {
      const settlementsResponse = await fetch(
        createUrl("/api/uaddresses/search/settlements", {
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
    const { regions, settlements, loaded } = this.state;

    if (!loaded) return null;

    const { index, type } = this.props;
    const {
      dictionaries: { COUNTRY, SETTLEMENT_TYPE, STREET_TYPE }
    } = this.props;
    const streetTypes = STREET_TYPE ? Object.entries(STREET_TYPE.values) : [];

    return (
      <>
        <Field name={`addresses[${index}].type`}>
          {({ input: { onChange, value } }) => (
            type === value || onChange(type), null
          )}
        </Field>
        <Field.Select
          name={`addresses[${index}].area`}
          placeholder="Область"
          items={regions.map(({ name }) => name)}
        />
        <Field name={`addresses[${index}].area`} subscription={{ value: true }}>
          {({ input: { value: area } }) => (
            <Field.Select
              name={`addresses[${index}].settlement`}
              disabled={!area}
              placeholder="Назва населеного пункту"
              itemToString={item => (item === null ? "" : item.settlement)}
              items={(settlements || []).map(
                ({ name, district, id, type }) => ({
                  settlement: name,
                  settlement_type: type,
                  settlement_id: id,
                  region: district
                })
              )}
              onInputValueChange={settlement =>
                settlement &&
                this.fetchSettlementsDebounced({ settlement, area })
              }
              renderItem={({ settlement_type, settlement, region }) => (
                <div>
                  <small>{SETTLEMENT_TYPE.values[settlement_type]}</small>
                  {` ${settlement}`}
                  {region && <small>, район: {region}</small>}
                </div>
              )}
            />
          )}
        </Field>
        <Field.Input name={`addresses[${index}].zip`} placeholder="Індекс" />
        <Flex justifyContent="space-between">
          <Box width={3 / 7} display="inherit">
            <Field.Select
              name={`addresses[${index}].street_type`}
              placeholder="Тип вулиці"
              format={value =>
                streetTypes.find(([key]) => key === value) || null
              }
              parse={item => (item == null ? undefined : item[0])}
              itemToString={item => (item == null ? "" : item[1])}
              renderItem={item => item[1]}
              items={streetTypes}
            />
          </Box>
          <Box width={3 / 7} display="inherit">
            <Field.Input
              name={`addresses[${index}].street`}
              placeholder="Назва вулиці"
            />
          </Box>
        </Flex>
        <Flex justifyContent="space-between">
          <Box width={3 / 7} display="inherit">
            <Field.Input
              name={`addresses[${index}].building`}
              placeholder="№ буд."
            />
          </Box>
          <Box width={3 / 7} display="inherit">
            <Field.Input
              name={`addresses[${index}].apartment`}
              placeholder="№ квартири"
            />
          </Box>
        </Flex>
      </>
    );
  }
}
const Addresses = connect(
  state => ({
    dictionaries: state.data.dictionaries
  }),
  { fetchDictionaries }
)(AddressComponent);
