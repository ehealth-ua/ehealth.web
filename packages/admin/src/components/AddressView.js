//@flow
import * as React from "react";
import DictionaryValue from "./DictionaryValue";
import { normalizeName } from "@ehealth/utils";

type AddressProps = {
  data: {
    zip?: string,
    area?: string,
    region?: string | { name: string },
    district?: { name: string },
    settlementType: string,
    type: string,
    settlement: string,
    name: string,
    streetType: string,
    street: string,
    building: string,
    apartment?: string
  }
};

const AddressView = ({ data }: AddressProps): React.Node => {
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
