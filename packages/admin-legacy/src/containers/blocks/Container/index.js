import React from "react";

import DictionaryValue from "../DictionaryValue";

const Container = ({ container }) => {
  if (!container) {
    return null;
  }

  const {
    numerator_value,
    numerator_unit,
    denumerator_value,
    denumerator_unit
  } = container;

  return numerator_value === denumerator_value ? (
    <div>
      {denumerator_value}{" "}
      <DictionaryValue dictionary="MEDICATION_UNIT" value={denumerator_unit} />
    </div>
  ) : (
    <div>
      {denumerator_value}{" "}
      <DictionaryValue dictionary="MEDICATION_UNIT" value={denumerator_unit} />{" "}
      містить {numerator_value}{" "}
      <DictionaryValue dictionary="MEDICATION_UNIT" value={numerator_unit} />
    </div>
  );
};

export default Container;
