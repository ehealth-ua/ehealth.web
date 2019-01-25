import React from "react";
import { Location } from "@reach/router";
import {
  parseSearchParams,
  stringifySearchParams,
  cleanDeep
} from "@ehealth/utils";
import isEqual from "lodash/isEqual";

const LocationParams = ({ children, render = children }) => (
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
