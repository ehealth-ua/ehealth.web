import React, { Component } from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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

import SpecialitiesQuery from "../qraphql/SpecialitiesQuery.graphql";
import SettlementQuery from "../qraphql/SettlementQuery.graphql";
import SearchEmployeeQuery from "../qraphql/SearchEmployeeQuery.graphql";
import SearchDivisionsByMapQuery from "../qraphql/SearchDivisionsByMapQuery.graphql";

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
      query={SearchEmployeeQuery}
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
        query={SettlementQuery}
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

const Table = ({ search, specialityTypes }) => {
  return !search.length ? (
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
          <Link to={`/division/${divisionId}`}>{divisionName}</Link>
        ),
        address: getFullAddress(addresses),
        legalEntityName,
        action: <Link to={`/employee/${id}`}>Показати деталі</Link>
      })}
      rowKeyExtractor={({ id }) => id}
    />
  );
};

class DivisionsMapView extends Component {
  state = {
    bounds: {},
    hoverItemId: null
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextState, this.state);
  }

  render() {
    const { hoverItemId, bounds } = this.state;
    const { north = "", east = "", south = "", west = "" } = bounds;
    return (
      <Query
        query={SearchDivisionsByMapQuery}
        variables={{
          north,
          east,
          south,
          west,
          page: 1,
          page_size: 50
        }}
      >
        {({ loading, error, data }) => {
          if (!data.divisions) return null;
          const { data: divisions } = data.divisions;
          let lng_radius = 0.00003, // degrees of longitude separation
            lat_to_lng = 111.23 / 71.7, // lat to long proportion in Warsaw
            angle = 0.5, // starting angle, in radians
            step = 2 * Math.PI / divisions.length,
            lat_radius = lng_radius / lat_to_lng;

          const filteredDivisions = divisions
            .filter(
              item => item.coordinates.latitude && item.coordinates.longitude
            )
            .map(item => {
              angle += step;
              return {
                ...item,
                coordinates: {
                  latitude:
                    item.coordinates.latitude + Math.sin(angle) * lat_radius,
                  longitude:
                    item.coordinates.longitude + Math.cos(angle) * lng_radius
                }
              };
            });
          return (
            <DivisionsMap
              center={this.center}
              zoom={this.zoom}
              items={filteredDivisions}
              activeItemId={0}
              hoverItemId={hoverItemId}
              onMapChange={({ bounds, center, zoom }) => {
                const { lat, lng } = center.toJSON();
                this.setState({ bounds: bounds.toJSON() });
                this.props.setSearchParamsImmediate(
                  { lat, lng, zoom },
                  "replace"
                );
              }}
              onMarkerOver={hoverItemId => this.setState({ hoverItemId })}
              onMarkerOut={() => this.setState({ hoverItemId: null })}
            />
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
}

const DivisionsMapWithHistory = withHistoryState(DivisionsMapView);

class SearchPage extends Component {
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

  render() {
    const { search } = this.state;
    return (
      <Query query={SpecialitiesQuery}>
        {({ loading, data }) => {
          if (!data.specialities) return null;
          const { data: [{ values: specialityTypes }] } = data.specialities;
          return (
            <Router>
              <>
                <Title.H1>Крок 1. Оберіть лікаря</Title.H1>
                <Form
                  onSubmit={() => null /* NOT USED, but required */}
                  subscription={{} /* No need to subscribe to anything */}
                >
                  <FlexWrap>
                    <FormAutoFetch debounce={500}>
                      {({ values, searchParams }) => (
                        <FlexInputsContainer>
                          <SelectWithQuery addSettlement={this.addSettlement} />
                          <InputsWithQuery
                            {...values}
                            searchParams={searchParams}
                            specialityTypes={specialityTypes}
                            addSearchData={this.addSearchData}
                          />
                        </FlexInputsContainer>
                      )}
                    </FormAutoFetch>
                    <Icon>
                      <Route
                        render={({ location }) => {
                          return !location.pathname.match(/\bmap\b/) ? (
                            <Link to={"/search/map"}>
                              <MapIcon
                                width={30}
                                height={30}
                                fill="currentColor"
                              />
                            </Link>
                          ) : (
                            <Link to={"/search"}>
                              <ListIcon
                                width={30}
                                height={30}
                                fill="currentColor"
                              />
                            </Link>
                          );
                        }}
                      />
                    </Icon>
                  </FlexWrap>
                </Form>
                <Switch>
                  <CustomRoute
                    exact
                    path="/search"
                    component={Table}
                    passedProps={{ search, specialityTypes }}
                  />
                  <CustomRoute
                    exact
                    path="/search/map"
                    component={DivisionsMapWithHistory}
                  />
                </Switch>
              </>
            </Router>
          );
        }}
      </Query>
    );
  }

  addSearchData({ data }) {
    this.setState({
      search: data
    });
  }
}

export default SearchPage;

const CustomRoute = ({ component: Component, passedProps, ...rest }) => (
  <Route
    {...rest}
    render={props => <Component {...props} {...passedProps} />}
  />
);

const FlexWrap = styled.div`
  position: relative;
  padding-right: 100px;
`;

const FlexInputsContainer = styled.div`
  display: flex;
  margin: 0 -10px;
`;

const FlexItem = styled.div`
  display: flex;
  width: 25%;
  margin: 0 10px;
`;

const Icon = styled.div`
  position: absolute;
  right: 0;
  top: 32px;
  line-height: 0;
  user-select: none;
`;
