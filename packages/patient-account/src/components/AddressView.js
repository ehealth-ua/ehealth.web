import React from "react";
import capitalize from "lodash/capitalize";

import DictionaryValue from "./DictionaryValue";

const AddressView = ({
  data: {
    zip,
    area,
    region,
    settlementType,
    settlement,
    streetType,
    street,
    building,
    apartment
  }
}) => (
  <>
    {zip && <>{zip}, </>}
    {formatArea(area)}, {region && <>{normalizeName(region)} район, </>}
    <>
      <DictionaryValue name="SETTLEMENT_TYPE" item={settlementType} />&nbsp;
      {normalizeName(settlement)}
    </>,{" "}
    <>
      {street && (
        <>
          <DictionaryValue name="STREET_TYPE" item={streetType} />{" "}
          {normalizeName(street)}&nbsp;
        </>
      )}
      {building}
    </>
    {apartment && <>, кв.&nbsp;{apartment}</>}
  </>
);

export default AddressView;

const formatArea = area => {
  if (/КРИМ/i.test(area)) {
    return normalizeName(area);
  } else if (/^м\./i.test(area)) {
    const [prefix, name] = area.split(/\.\s*/);
    return `${prefix.toLowerCase()}. ${normalizeName(name)}`;
  } else {
    return `${normalizeName(area)} область`;
  }
};

const normalizeName = (name = "") =>
  name.replace(/[\wа-яґїіє]+/gi, word => capitalize(word));
