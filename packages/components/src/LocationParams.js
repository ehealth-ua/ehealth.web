import React from "react";
import { Location } from "@reach/router";
import { parseSearchParams, stringifySearchParams } from "@ehealth/utils";
import isEqual from "lodash/isEqual";

const LocationParams = ({ children, render = children }) => (
  <Location
    children={({ location, navigate }) =>
      render({
        locationParams: parseSearchParams(location.search),
        setLocationParams: params => {
          const parseParams = parseSearchParams(location.search);
          if (Object.entries(params).length && !isEqual(parseParams, params)) {
            const query = stringifySearchParams(params);
            navigate(`${location.pathname}?${query}`);
          }
        }
      })
    }
  />
);

export default LocationParams;