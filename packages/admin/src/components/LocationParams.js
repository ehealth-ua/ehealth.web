import React from "react";
import { Location } from "@reach/router";
import { parseSearchParams, stringifySearchParams } from "@ehealth/utils";

const LocationParams = ({ children, render = children }) => (
  <Location
    children={({ location, navigate }) =>
      render({
        locationParams: parseSearchParams(location.search),
        setLocationParams: params => {
          if (Object.entries(params).length) {
            const query = stringifySearchParams(params);
            if (location.search === query || location.search === `?${query}`)
              return;
            navigate(`${location.pathname}?${query}`);
          }
        }
      })
    }
  />
);

export default LocationParams;
