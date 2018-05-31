import { titleCase } from "@ehealth/utils";

const getDictValue = (dict, code) => {
  return Object.entries(dict).map(
    ([key, value]) => key === code && titleCase(value)
  );
};

export default getDictValue;
