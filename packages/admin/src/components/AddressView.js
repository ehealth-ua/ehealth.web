//@flow
import * as React from "react";
import gql from "graphql-tag";
import DictionaryValue from "./DictionaryValue";
import { normalizeName } from "@ehealth/utils";
import type { Address } from "@ehealth-ua/schema";

const AddressView = ({ data }: Address): React.Node => {
  if (!data) return null;

  const { zip, streetType, street, building, apartment } = data;

  const [region, district, settlementType, settlement] = Object.keys(
    data
  ).includes("area")
    ? [data.area, data.region, data.settlementType, data.settlement]
    : [
        data.region && data.region.name,
        data.district && data.district.name,
        data.type,
        data.name
      ];

  return (
    <>
      {zip && <>{zip}, </>}
      {region && <>{formatDistrict(region)}, </>}
      {district && <>{normalizeName(district)} район, </>}
      <>
        <DictionaryValue name="SETTLEMENT_TYPE" item={settlementType} />
        &nbsp;
        {normalizeName(settlement)}
      </>
      <>
        {street && (
          <>
            ,&nbsp;
            <DictionaryValue name="STREET_TYPE" item={streetType} />
            &nbsp;
            {normalizeName(street)}
            &nbsp;
          </>
        )}
        {building}
      </>
      {apartment && (
        <>
          , кв.&nbsp;
          {apartment}
        </>
      )}
    </>
  );
};

AddressView.fragments = {
  entry: gql`
    fragment Addresses on Address {
      type
      country
      area
      region
      settlement
      settlementType
      settlementId
      streetType
      street
      building
      apartment
      zip
    }
  `
};

export default AddressView;

const formatDistrict = area => {
  if (/КРИМ/i.test(area)) {
    return normalizeName(area);
  } else if (/^м\./i.test(area)) {
    const [prefix, name] = area.split(/\.\s*/);
    return `${prefix.toLowerCase()}. ${normalizeName(name)}`;
  } else {
    return `${normalizeName(area)} область`;
  }
};
