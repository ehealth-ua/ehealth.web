import React from "react";
import { GoogleMapsWrapper } from "./MapView";
import Spinner from "../components/Spinner";

const DivisionsMap = props => (
  <GoogleMapsWrapper
    {...props}
    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAEnlhRXQtwPRZhIvJ6bhNrfBJFP_XAZ6s`}
    loadingElement={<Spinner />}
    containerElement={
      <div style={{ position: "relative", width: "100%", height: 600 }} />
    }
    mapElement={
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      />
    }
  />
);

export default DivisionsMap;
