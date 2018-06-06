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
  Link,
  withHistoryState
} from "@ehealth/components";
import {
  getFullName,
  getFullAddress,
  getSpecialities,
  titleCase
} from "@ehealth/utils";
import { MapIcon, ListIcon } from "@ehealth/icons";
import isEqual from "lodash/isEqual";

import DivisionsMap from "../components/DivisionsMap";

const DEFAULT_CENTER = { lat: 50.4021368, lng: 30.4525107 };
const DEFAULT_ZOOM = 9;

const InputsWithQuery = props => {
  const { specialityTypes, addSearchData, searchParams } = props;

  let settlementRegion;
  let settlementName;
  let specialityName = "";

  const fullName = props.fullName || searchParams.fullName || "";
  const divisionName = props.divisionName || searchParams.divisionName || "";
  const settlement = props.settlement || searchParams.settlement || {};
  const speciality = props.speciality || searchParams.speciality || "";

  if (settlement && Object.keys(settlement).length) {
    settlementRegion = settlement.region || searchParams.region || "";
    settlementName = settlement.settlement || searchParams.settlement || "";
  } else {
    settlementRegion = "";
    settlementName = "";
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
};

class SelectWithQuery extends Component {
  state = {
    settlement: ""
  };

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
                itemToString={item => (item ? titleCase(item.settlement) : "")}
                items={settlements.map(({ name, district, type }) => ({
                  settlement: name,
                  settlement_type: type,
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

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.addSearchData = this.addSearchData.bind(this);
  }
  state = {
    search: [],
    bounds: {},
    opened: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  render() {
    const { settlementName, search, hoverItemId, opened } = this.state;
    const activeItemId = 0;
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
            divisions
              @rest(
                path: "/divisions"
                type: "DivisionsPayload"
                endpoint: "stats"
              ) {
              data
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (!data.specialities && !data.divisions) return null;
          const { data: [{ values: specialityTypes }] } = data.specialities;
          const { data: divisions } = data.divisions;
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
                      <FlexIcon
                        onClick={() => {
                          this.setState({ opened: !opened });
                        }}
                      >
                        {!opened ? (
                          <IconWrapper>
                            <MapIcon width={30} height={30} />
                          </IconWrapper>
                        ) : (
                          <IconWrapper>
                            <ListIcon width={30} height={30} />
                          </IconWrapper>
                        )}
                      </FlexIcon>
                    </FlexContainer>
                  )}
                </FormAutoFetch>
              </Form>
              {!opened ? (
                !search.length ? (
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
                      division: {
                        id: divisionId,
                        name: divisionName,
                        addresses
                      },
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
                        <Link to={`/search/employee/${id}`}>
                          Показати деталі
                        </Link>
                      )
                    })}
                    rowKeyExtractor={({ id }) => id}
                  />
                )
              ) : (
                <DivisionsMap
                  center={this.center}
                  zoom={this.zoom}
                  items={divisions.filter(
                    item =>
                      item.coordinates.latitude && item.coordinates.longitude
                  )}
                  activeItemId={activeItemId}
                  hoverItemId={hoverItemId}
                  onMapChange={({ bounds, center, zoom }) => {
                    const { lat, lng } = center.toJSON();
                    this.setState({ bounds: bounds.toJSON() });
                    this.props.setSearchParamsImmediate(
                      { lat, lng, zoom },
                      "replace"
                    );
                  }}
                  onMarkerClick={this.setActiveItem}
                  onMarkerOver={hoverItemId => this.setState({ hoverItemId })}
                  onMarkerOut={() => this.setState({ hoverItemId: null })}
                />
              )}
            </>
          );
        }}
      </Query>
    );
  }

  get center() {
    let { lat, lng } = this.props.searchParams;
    [lat, lng] = [lat, lng].map(n => parseFloat(n, 10));

    return [lat, lng].every(v => !isNaN(v)) ? { lat, lng } : DEFAULT_CENTER;
  }

  get zoom() {
    const { zoom } = this.props.searchParams;
    return parseInt(zoom, 10) || DEFAULT_ZOOM;
  }

  addSearchData({ data }) {
    this.setState({
      search: data
    });
  }
}

export default withHistoryState(SearchPage);

const FlexContainer = styled.div`
  display: flex;
  margin: 0 -10px;
`;

const FlexItem = styled.div`
  display: flex;
  width: 25%;
  margin: 0 10px;
`;

const FlexIcon = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 10%;
  margin-right: 10px;
`;

const IconWrapper = styled.div`
  margin-bottom: 20px;
  line-height: 0;
  user-select: none;
`;
