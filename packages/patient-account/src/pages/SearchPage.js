import React, { Component } from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import {
  Heading,
  Field,
  Form,
  FormAutoFetch,
  CabinetTable,
  Link,
  withHistoryState,
  SearchParams
} from "@ehealth/components";
import { getFullName, titleCase } from "@ehealth/utils";
import { MapIcon, ListIcon } from "@ehealth/icons";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";

import DivisionsMap from "../components/DivisionsMap";
import DictionaryValue from "../components/DictionaryValue";
import AddressView from "../components/AddressView";

import SettlementQuery from "../graphql/SettlementQuery.graphql";
import SearchEmployeeQuery from "../graphql/SearchEmployeeQuery.graphql";
import SearchDivisionsByMapQuery from "../graphql/SearchDivisionsByMapQuery.graphql";

const DEFAULT_CENTER = { lat: 50.4021368, lng: 30.4525107 };
const DEFAULT_ZOOM = 9;

class SearchPage extends Component {
  state = {
    search: [],
    location: ""
  };

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps, this.props)) {
      this.setState({
        location: nextProps.location.pathname
      });
    }
  }

  componentWillMount() {
    this.setState({
      location: this.props.location.pathname
    });
  }

  render() {
    const { search, location } = this.state;
    return (
      <>
        <Heading.H1>Крок 1. Оберіть лікаря</Heading.H1>
        <SearchParams>
          {params => (
            <Form
              onSubmit={() => null /* NOT USED, but required */}
              subscription={{} /* No need to subscribe to anything */}
              initialValues={params}
            >
              <FlexWrap>
                <FormAutoFetch debounce={500}>
                  {({ values, setSearchParams }) => (
                    <FlexInputsContainer>
                      <SettlementSelectWithQuery
                        addSettlement={this.addSettlement}
                        setSearchParams={setSearchParams}
                        location={this.state.location}
                      />
                      <InputsWithQuery
                        {...values}
                        searchParams={params}
                        addSearchData={this.addSearchData}
                        location={this.state.location}
                      />
                    </FlexInputsContainer>
                  )}
                </FormAutoFetch>
                <Icon>
                  {!location.match(/\bmap\b/) ? (
                    <Link to={"/search/map"}>
                      <MapIcon width={30} height={30} fill="currentColor" />
                    </Link>
                  ) : (
                    <Link to={"/search"}>
                      <ListIcon width={30} height={30} fill="currentColor" />
                    </Link>
                  )}
                </Icon>
              </FlexWrap>
            </Form>
          )}
        </SearchParams>
        <ContentWrapper>
          {!location.match(/\bmap\b/) ? (
            <Table search={search} />
          ) : (
            <DivisionsMapWithHistory />
          )}
        </ContentWrapper>
      </>
    );
  }

  addSearchData = ({ data }) => this.setState({ search: data });
}

export default SearchPage;

const InputsWithQuery = props => {
  const { addSearchData, searchParams, location } = props;

  const fullName = searchParams.fullName || "";
  const divisionName = searchParams.divisionName || "";
  const settlementName = searchParams.settlement || "";
  const settlementRegion = searchParams.region || "";
  const specialityName = searchParams.speciality || "";

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
      context={{ credentials: "same-origin" }}
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
                disabled={location.match(/\bmap\b/)}
              />
            </FlexItem>
            <FlexItem>
              <Field.Input
                label={<b>Повне ім&#700;я лікаря</b>}
                placeholder="Прізвище, ім&#700;я, по-батькові"
                name="fullName"
                value={fullName}
                disabled={location.match(/\bmap\b/)}
              />
            </FlexItem>
            <FlexItem>
              <DictionaryValue
                name="SPECIALITY_TYPE"
                render={dict => (
                  <Field.Select
                    name="speciality"
                    label={<b>Спеціальність</b>}
                    placeholder="Виберіть спеціальність"
                    itemToString={item => (item == null ? "" : dict[item])}
                    items={Object.keys(dict).filter(
                      item => item !== "PHARMACIST" && item !== "PHARMACIST2"
                    )}
                    renderItem={item => dict[item]}
                    disabled={location.match(/\bmap\b/)}
                  />
                )}
              />
            </FlexItem>
          </>
        );
      }}
    </Query>
  );
};

class SettlementSelectWithQuery extends Component {
  state = {
    settlement: ""
  };

  render() {
    const { location } = this.props;
    return (
      <Query
        query={SettlementQuery}
        variables={{ settlement: this.state.settlement }}
        context={{ credentials: "same-origin" }}
      >
        {({ loading, error, data, refetch }) => {
          if (!data.settlements) return null;
          const settlements = data.settlements.data;
          return (
            <FlexItem>
              <Field.Select
                name="settlement"
                label={<b>Населений пункт</b>}
                placeholder="Введіть населений пункт"
                itemToString={(item = "") => {
                  if (!item) return "";
                  return typeof item === "string"
                    ? titleCase(item)
                    : titleCase(item.settlement);
                }}
                items={settlements.map(({ name, district, type }) => ({
                  settlement: name,
                  settlementType: type,
                  region: district || undefined
                }))}
                onInputValueChange={debounce(settlement => {
                  if (!settlement) {
                    this.props.setSearchParams({
                      settlement: null,
                      settlementType: null,
                      region: null
                    });
                  }
                  return refetch({ settlement });
                }, 500)}
                renderItem={address => <AddressView data={address} />}
                disabled={location.match(/\bmap\b/)}
              />
            </FlexItem>
          );
        }}
      </Query>
    );
  }
}

const Table = ({ search }) => {
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
        legalEntity: { name: legalEntityName }
      }) => ({
        name: getFullName(party),
        job: (
          <DictionaryValue
            name="SPECIALITY_TYPE"
            item={party.specialities[0].speciality}
          />
        ),
        divisionName: (
          <Link to={`/division/${divisionId}`}>{divisionName}</Link>
        ),
        address: <AddressView data={addresses} />,
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
    return !(
      isEqual(nextProps.searchParams, this.props.searchParams) &&
      isEqual(nextState, this.state)
    );
  }

  render() {
    const { hoverItemId, bounds } = this.state;
    const { north = "", east = "", south = "", west = "" } = bounds;
    const {
      divisionName = "",
      settlement = "",
      region = ""
    } = this.props.searchParams;
    return (
      <Query
        query={SearchDivisionsByMapQuery}
        variables={{
          north,
          east,
          south,
          west,
          divisionName,
          settlement,
          region,
          page: 1,
          pageSize: 50
        }}
        context={{ credentials: "same-origin" }}
      >
        {({ loading, error, data }) => {
          if (error || !data.divisions) return null;

          const { data: divisions } = data.divisions;
          let lngRadius = 0.00003, // degrees of longitude separation
            latToLng = 111.23 / 71.7, // lat to long proportion in Warsaw
            angle = 0.5, // starting angle, in radians
            step = 2 * Math.PI / divisions.length,
            latRadius = lngRadius / latToLng;

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
                    item.coordinates.latitude + Math.sin(angle) * latRadius,
                  longitude:
                    item.coordinates.longitude + Math.cos(angle) * lngRadius
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
  top: 43px;
  line-height: 0;
  user-select: none;
`;

const ContentWrapper = styled.div`
  margin-top: 20px;
`;
