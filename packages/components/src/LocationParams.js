// @flow
import * as React from "react";
import { Location } from "@reach/router";
import {
  parseSearchParams,
  stringifySearchParams,
  cleanDeep
} from "@ehealth/utils";
import isEqual from "lodash/isEqual";

export type URLSearchParams = {
  [string]: string | { [string]: string }
};
export type SetLocationParamsProp = URLSearchParams => void;
export type LocationParamsProps = {
  children: ({
    locationParams: URLSearchParams,
    setLocationParams?: SetLocationParamsProp
  }) => React.Node,
  render?: ({
    locationParams: URLSearchParams,
    setLocationParams?: SetLocationParamsProp
  }) => React.Node
};

const LocationParams = ({
  children,
  render = children
}: LocationParamsProps): React.Node => (
  <Location
    children={({ location, navigate }) =>
      render({
        locationParams: parseSearchParams(location.search),
        setLocationParams: params => {
          const parsedLocationSearch = parseSearchParams(location.search);
          const parsedParams = cleanDeep(params);
          if (!isEqual(parsedLocationSearch, parsedParams)) {
            const query = stringifySearchParams(parsedParams);
            navigate(`${location.pathname}?${query}`);
          }
        }
      })
    }
  />
);

export default LocationParams;
