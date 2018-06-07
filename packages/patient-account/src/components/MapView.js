import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import styled from "react-emotion/macro";

import { ArrowRightIcon } from "@ehealth/icons";
import { Link } from "@ehealth/components";

export const GoogleMapsWrapper = withScriptjs(
  withGoogleMap(props => {
    const {
      center,
      zoom,
      items,
      activeItemId,
      hoverItemId,
      onMapChange,
      onMarkerOver,
      onMarkerOut
    } = props;
    let map;
    const activeItem = items.find(({ id }) => id === activeItemId);
    const hoverItem = items.find(({ id }) => id === hoverItemId);
    return (
      <GoogleMap
        ref={ref => (map = ref)}
        center={center}
        zoom={zoom}
        options={{ minZoom: 5 }}
        onIdle={() =>
          onMapChange({
            bounds: map.getBounds(),
            center: map.getCenter(),
            zoom: map.getZoom()
          })
        }
      >
        <MarkerClusterer>
          {items.map(({ id, coordinates: { latitude, longitude } }) => (
            <Marker
              key={id}
              position={{
                lat: parseFloat(latitude, 10),
                lng: parseFloat(longitude, 10)
              }}
              zIndex={2}
              defaultAnimation={0}
              icon={
                id === activeItemId
                  ? {
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 8,
                      strokeColor: "#4880ed",
                      strokeWeight: 6,
                      fillColor: "#ffffff",
                      fillOpacity: 1
                    }
                  : {
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 4,
                      strokeColor: "#4880ed",
                      fillColor: "#4880ed",
                      fillOpacity: 1
                    }
              }
              onMouseOver={() => onMarkerOver(id)}
            />
          ))}
        </MarkerClusterer>

        {activeItem && (
          <Marker
            position={{
              lat: activeItem.coordinates.latitude,
              lng: activeItem.coordinates.longitude
            }}
            zIndex={3}
            defaultAnimation={0}
            icon={{
              url: "images/icons/marker.png",
              scaledSize: { x: 33, y: 47 },
              anchor: { x: 17, y: 60 }
            }}
          />
        )}

        {hoverItem && (
          <Marker
            position={{
              lat: hoverItem.coordinates.latitude,
              lng: hoverItem.coordinates.longitude
            }}
            zIndex={1}
            defaultAnimation={0}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 20,
              strokeColor: "#4880ed",
              fillColor: "#4880ed",
              fillOpacity: 1
            }}
            opacity={0.1}
            onMouseOut={onMarkerOut}
          >
            <InfoBox
              options={{ closeBoxURL: "", enableEventPropagation: true }}
            >
              <SearchMapTooltip
                active={hoverItemId === activeItemId}
                id={hoverItem.id}
                name={hoverItem.name}
                legalEntity={hoverItem.legal_entity}
                address={hoverItem.addresses.find(
                  ({ type }) => type === "RESIDENCE"
                )}
                contacts={hoverItem.contacts}
                onMouseLeave={onMarkerOut}
              />
            </InfoBox>
          </Marker>
        )}
      </GoogleMap>
    );
  })
);

const SearchMapTooltip = ({
  active,
  id,
  name,
  legalEntity,
  address,
  contacts: { phones: [phone] },
  onMouseLeave
}) => (
  <Popup onMouseLeave={onMouseLeave}>
    <Title>
      {name} ({legalEntity.name})
    </Title>
    <div>{address.settlement}</div>
    <div>
      {address.street}, {address.building}
    </div>
    <Phone>Тел.: {phone.number}</Phone>
    <Link
      to={`/division/${id}`}
      icon={<ArrowRightIcon height="14px" fill="#2292f2" />}
    >
      Детальніше
    </Link>
  </Popup>
);

const Popup = styled.div`
  width: 200px;
  background: #fff;
  padding: 20px;
  font-size: 14px;
`;

const Title = styled.b`
  display: block;
  font-weight: "bold";
  margin-bottom: 5px;
`;

const Phone = styled.div`
  margin: 5px 0;
`;
