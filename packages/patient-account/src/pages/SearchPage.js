import React, { Component } from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { Route } from "react-router-dom";
import {
  Heading,
  Field,
  Form,
  CabinetTable,
  Link,
  Spinner,
  SearchParams,
  Pagination
} from "@ehealth/components";
import { getFullName, titleCase } from "@ehealth/utils";
import { MapIcon, ListIcon } from "@ehealth/icons";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";
import debounce from "lodash/debounce";

import DivisionsMap from "../components/DivisionsMap";
import DictionaryValue from "../components/DictionaryValue";
import AddressView from "../components/AddressView";

import SettlementQuery from "../graphql/SettlementQuery.graphql";
import SearchEmployeeQuery from "../graphql/SearchEmployeeQuery.graphql";
import SearchDivisionsByMapQuery from "../graphql/SearchDivisionsByMapQuery.graphql";

const DEFAULT_CENTER = { lat: 50.4021368, lng: 30.4525107 };
const DEFAULT_ZOOM = 9;

const SearchPage = () => (
  <div data-test="search">
    <Heading.H1>Крок 1. Оберіть лікаря</Heading.H1>
    <Route path="/search" component={SearchTable} exact />
    <Route path="/search/map" component={DivisionMap} />
  </div>
);

export default SearchPage;

const SearchTable = () => {
  return (
    <>
      <FormSearch />
      <SearchParams>
        {({
          searchParams: {
            fullName = "",
            divisionName = "",
            speciality = "",
            page = "1",
            pageSize = "10",
            settlement: { settlement = "", region: settlementRegion = "" } = {}
          }
        }) => {
          return (
            <Query
              query={SearchEmployeeQuery}
              fetchPolicy="cache-first"
              variables={{
                fullName,
                divisionName,
                settlement,
                settlementRegion,
                speciality,
                page,
                pageSize
              }}
              context={{ credentials: "same-origin" }}
            >
              {({ loading, error, data }) => {
                if (loading || error) return <Spinner />;
                const { data: search, paging } = data.search;
                return !search.length ? (
                  "Нічого не знайдено"
                ) : (
                  <>
                    <CabinetTable
                      data={search}
                      header={{
                        name: (
                          <>
                            ПІБ
                            <br />
                            лікаря
                          </>
                        ),
                        job: "Спеціальність",
                        divisionName: (
                          <>
                            Назва
                            <br />
                            відділення
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
                          <Link to={`/division/${divisionId}`}>
                            {divisionName}
                          </Link>
                        ),
                        address: <AddressView data={addresses} />,
                        legalEntityName,
                        action: (
                          <Link to={`/employee/${id}`} dataTest="details">
                            Показати деталі
                          </Link>
                        )
                      })}
                      rowKeyExtractor={({ id }) => id}
                    />
                    <Pagination totalPages={paging.totalPages} />
                  </>
                );
              }}
            </Query>
          );
        }}
      </SearchParams>
    </>
  );
};

const FormSearch = () => (
  <SearchParams>
    {({ searchParams, setSearchParamsImmediate }) => (
      <FlexWrap>
        <Form
          onSubmit={() => null /* NOT USED, but required */}
          initialValues={searchParams}
        >
          <Form.AutoSubmit
            onSubmit={values => {
              const clearPage = !isEqual(
                omit(values, ["page"]),
                omit(searchParams, ["page"])
              )
                ? { page: 1 }
                : {};
              return setSearchParamsImmediate({ ...values, ...clearPage });
            }}
            delay={1000}
          />
          <FlexInputsContainer>
            <FlexItem>
              <Query
                query={SettlementQuery}
                fetchPolicy="cache-first"
                variables={{ settlement: "" }}
                context={{ credentials: "same-origin" }}
              >
                {({ loading, error, data: { settlements = {} }, refetch }) => (
                  <Field.Select
                    name="settlement"
                    label={<b>Населений пункт</b>}
                    placeholder="Введіть населений пункт"
                    itemToString={item => {
                      if (!item) return "";
                      return typeof item === "string"
                        ? titleCase(item)
                        : titleCase(item.settlement);
                    }}
                    items={
                      loading || error
                        ? []
                        : settlements.data.map(
                            ({ name, district, type, region }) => ({
                              area: region || undefined,
                              settlement: name,
                              settlementType: type,
                              region: district || undefined
                            })
                          )
                    }
                    onInputValueChange={debounce(
                      settlement => refetch({ settlement }),
                      500
                    )}
                    renderItem={address => <AddressView data={address} />}
                    size="small"
                  />
                )}
              </Query>
            </FlexItem>
            <FlexItem>
              <Field.Input
                label={<b>Назва відділення</b>}
                placeholder="Відділення"
                name="divisionName"
                size="small"
              />
            </FlexItem>
            <FlexItem>
              <Field.Input
                label={<b>Повне ім&#700;я лікаря</b>}
                placeholder="Прізвище, ім&#700;я, по-батькові"
                name="fullName"
                size="small"
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
                    size="small"
                    dataTestButton="specialities"
                  />
                )}
              />
            </FlexItem>
          </FlexInputsContainer>
          <Icon>
            <Link to="/search/map" replace>
              <MapIcon width={30} height={30} fill="currentColor" />
            </Link>
          </Icon>
        </Form>
      </FlexWrap>
    )}
  </SearchParams>
);

const DivisionMap = () => (
  <>
    <FlexWrap>
      <Icon>
        <Link to="/search" replace>
          <ListIcon width={30} height={30} fill="currentColor" />
        </Link>
      </Icon>
    </FlexWrap>
    <SearchParams>
      {({ searchParams, setSearchParamsImmediate }) => (
        <DivisionsMapView
          searchParams={searchParams}
          setSearchParamsImmediate={setSearchParamsImmediate}
        />
      )}
    </SearchParams>
  </>
);

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
    const { setSearchParamsImmediate } = this.props;
    const { north = "", east = "", south = "", west = "" } = bounds;
    return (
      <Query
        query={SearchDivisionsByMapQuery}
        fetchPolicy="cache-first"
        variables={{
          north,
          east,
          south,
          west,
          page: 1,
          pageSize: 50
        }}
        context={{ credentials: "same-origin" }}
      >
        {({ loading, error, data }) => {
          if (error || !data.divisions) return null;
          const { data: divisions } = data.divisions;
          return (
            <DivisionsMap
              center={this.center}
              zoom={this.zoom}
              items={filteredDivisions(divisions)}
              activeItemId={0}
              hoverItemId={hoverItemId}
              onMapChange={({ bounds, center, zoom }) => {
                const { lat, lng } = center.toJSON();
                this.setState({ bounds: bounds.toJSON() });
                setSearchParamsImmediate({ lat, lng, zoom }, "replace");
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

const filteredDivisions = divisions => {
  let lngRadius = 0.00003, // degrees of longitude separation
    latToLng = 111.23 / 71.7, // lat to long proportion in Warsaw
    angle = 0.5, // starting angle, in radians
    step = (2 * Math.PI) / divisions.length,
    latRadius = lngRadius / latToLng;
  return divisions
    .filter(item => item.coordinates.latitude && item.coordinates.longitude)
    .map(item => {
      angle += step;
      return {
        ...item,
        coordinates: {
          latitude: item.coordinates.latitude + Math.sin(angle) * latRadius,
          longitude: item.coordinates.longitude + Math.cos(angle) * lngRadius
        }
      };
    });
};

const FlexWrap = styled.div`
  position: relative;
  padding-right: 50px;
  height: 68px;
  margin-bottom: 10px;
`;

const FlexInputsContainer = styled.div`
  display: flex;
  margin: 0 -10px;
`;

const FlexItem = styled.div`
  width: 25%;
  margin: 0 10px;
`;

const Icon = styled.div`
  position: absolute;
  right: 0;
  top: 36px;
  line-height: 0;
  user-select: none;
`;
