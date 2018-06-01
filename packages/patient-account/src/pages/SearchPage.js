import React, { Component } from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";
import {
  Title,
  Field,
  Form,
  FormAutoFetch,
  CabinetTable,
  Link
} from "@ehealth/components";
import {
  getFullName,
  getFullAddress,
  getSpecialities,
  titleCase
} from "@ehealth/utils";
import isEqual from "lodash/isEqual";

class InputsWithQuery extends Component {
  state = { searchParams: null };
  shouldComponentUpdate(nextProps) {
    return !isEqual(
      Object.entries(nextProps).filter(
        ([key, value]) => typeof value !== "function"
      ),
      Object.entries(this.props).filter(
        ([key, value]) => typeof value !== "function"
      )
    );
  }
  render() {
    const { specialityTypes, addSearchData, searchParams } = this.props;

    let settlementRegion = "";
    let settlementName = "";
    let specialityName = "";

    const fullName = this.props.fullName || searchParams.fullName || "";
    const divisionName =
      this.props.divisionName || searchParams.divisionName || "";
    const settlement = this.props.settlement || searchParams.settlement || "";
    const speciality = this.props.speciality || searchParams.speciality || "";

    if (settlement && Object.keys(settlement).length) {
      settlementRegion = settlement.region || searchParams.region || "";
      settlementName = settlement.settlement || searchParams.settlement || "";
    }
    Object.entries(specialityTypes).map(
      ([key, value]) =>
        specialityTypes[key] === speciality ? (specialityName = key) : null
    );

    return (
      <Query
        query={gql`
          query(
            $fullName: String!
            $divisionName: String!
            $specialityName: String!
            $settlementName: String!
            $settlementRegion: String!
          ) {
            search(
              fullName: $fullName
              divisionName: $divisionName
              specialityName: $specialityName
              settlementName: $settlementName
              settlementRegion: $settlementRegion
            )
              @rest(
                path: "/stats/employees?employee_type=DOCTOR&full_name=:fullName&speciality=:specialityName&division_name=:divisionName&settlement=:settlementName&region=:settlementRegion&is_available=true&page=1&page_size=50"
                type: "SearchPayload"
              ) {
              data
            }
          }
        `}
        variables={{
          fullName,
          divisionName,
          settlementName,
          settlementRegion,
          specialityName
        }}
      >
        {({ loading, error, data }) => {
          if (!data.search) return null;
          addSearchData(data.search);
          return (
            <>
              <FlexItem>
                <Field.Input
                  label={<b>Назва відділення</b>}
                  placeholder="Відділення"
                  name="divisionName"
                  value={divisionName}
                />
              </FlexItem>
              <FlexItem>
                <Field.Input
                  label={<b>Повне ім'я лікаря</b>}
                  placeholder="Прізвище, ім'я, по-батькові"
                  name="fullName"
                  value={fullName}
                />
              </FlexItem>
              <FlexItem>
                <Field.Select
                  name="speciality"
                  label={<b>Спеціальність</b>}
                  placeholder="Виберіть спеціальність"
                  itemToString={item => item}
                  items={Object.entries(specialityTypes).map(
                    ([key, value]) => value
                  )}
                  renderItem={item => item}
                />
              </FlexItem>
            </>
          );
        }}
      </Query>
    );
  }
}

class SelectWithQuery extends Component {
  state = {
    settlement: ""
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextState, this.state);
  }

  render() {
    return (
      <Query
        query={gql`
          query($settlement: String!) {
            settlements(settlement: $settlement)
              @rest(
                path: "/uaddresses/settlements?name=:settlement&page=1&page_size=20"
                type: "SettlementsPayload"
              ) {
              data
            }
          }
        `}
        variables={{ settlement: this.state.settlement }}
      >
        {({ loading, error, data }) => {
          if (!data.settlements) return null;
          const settlements = data.settlements.data;
          return (
            <FlexItem>
              <Field.Select
                name="settlement"
                label={<b>Населений пункт</b>}
                placeholder="Введіть населений пункт"
                itemToString={item => item && titleCase(item.settlement)}
                items={settlements.map(({ name, district, id, type }) => ({
                  settlement: name,
                  settlement_type: type,
                  settlement_id: id,
                  region: district || undefined
                }))}
                onInputValueChange={settlement => {
                  this.setState({ settlement });
                }}
                renderItem={address => getFullAddress(address)}
              />
            </FlexItem>
          );
        }}
      </Query>
    );
  }
}

export default class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.addSearchData = this.addSearchData.bind(this);
  }
  state = {
    search: []
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextState, this.state);
  }

  addSearchData({ data }) {
    this.setState({
      search: data
    });
  }

  render() {
    const { settlementName, search } = this.state;
    return (
      <Query
        query={gql`
          query {
            specialities
              @rest(
                path: "/dictionaries?name=SPECIALITY_TYPE"
                type: "SpecialitiesPayload"
              ) {
              data
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (!data.specialities) return null;
          const { data: [{ values: specialityTypes }] } = data.specialities;
          return (
            <>
              <Title.H1>Крок 1. Оберіть лікаря</Title.H1>
              <Form
                onSubmit={() => null /* NOT USED, but required */}
                subscription={{} /* No need to subscribe to anything */}
              >
                <FormAutoFetch debounce={500}>
                  {({ values, searchParams }) => (
                    <FlexContainer>
                      <SelectWithQuery
                        addSettlement={this.addSettlement}
                        settlementName={settlementName}
                      />
                      <InputsWithQuery
                        {...values}
                        searchParams={searchParams}
                        specialityTypes={specialityTypes}
                        addSearchData={this.addSearchData}
                      />
                    </FlexContainer>
                  )}
                </FormAutoFetch>
              </Form>
              {!search.length ? (
                "Нічого не знайдено"
              ) : (
                <CabinetTable
                  data={search}
                  header={{
                    name: (
                      <>
                        ПІБ<br />лікаря
                      </>
                    ),
                    job: "Спеціальність",
                    divisionName: (
                      <>
                        Назва<br />відділення
                      </>
                    ),
                    address: "Адреса",
                    legalEntityName: "Медзаклад",
                    action: "Дія"
                  }}
                  renderRow={({
                    id,
                    party,
                    division: { id: divisionId, name: divisionName, addresses },
                    legal_entity: { name: legalEntityName }
                  }) => ({
                    name: getFullName(party),
                    job: getSpecialities(party.specialities, specialityTypes),
                    divisionName: (
                      <Link to={`/search/division/${divisionId}`}>
                        {divisionName}
                      </Link>
                    ),
                    address: getFullAddress(addresses),
                    legalEntityName,
                    action: (
                      <Link to={`/search/employee/${id}`}>Показати деталі</Link>
                    )
                  })}
                  rowKeyExtractor={({ id }) => id}
                />
              )}
            </>
          );
        }}
      </Query>
    );
  }
}

const FlexContainer = styled.div`
  display: flex;
  margin: 0 -10px;
`;

const FlexItem = styled.div`
  display: flex;
  width: 25%;
  margin: 0 10px;
`;
