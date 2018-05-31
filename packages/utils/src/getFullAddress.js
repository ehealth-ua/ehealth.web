import { titleCase } from "@ehealth/utils";

const streetTypeObj = {
  LINE: "лінія",
  PASS: "провулок",
  ROAD: "дорога",
  ALLEY: "алея",
  BLOCK: "квартал",
  TRACT: "урочище",
  ASCENT: "узвіз",
  AVENUE: "проспект",
  MAIDAN: "майдан",
  SQUARE: "площа",
  STREET: "вулиця",
  HIGHWAY: "шосе",
  PASSAGE: "проїзд",
  STATION: "станція",
  ENTRANCE: "в’їзд",
  FORESTRY: "лісництво",
  BOULEVARD: "бульвар",
  RIVER_SIDE: "набережна",
  BLIND_STREET: "тупик",
  HOUSING_AREA: "житловий масив",
  MICRODISTRICT: "мікрорайон",
  MILITARY_BASE: "військова частина",
  SELECTION_BASE: "селекційна станція"
};

const settlementTypeObj = {
  CITY: "місто",
  VILLAGE: "село",
  TOWNSHIP: "селище міського типу",
  SETTLEMENT: "селище"
};

const getFullAddress = ({
  zip,
  country,
  area,
  region,
  settlement,
  settlement_type,
  street,
  street_type,
  building,
  apartment
}) => {
  const getStreet = [streetTypeObj[street_type], street].join(" ");
  const getSettlement = [
    settlementTypeObj[settlement_type],
    titleCase(settlement)
  ].join(" ");
  const address = [
    zip,
    country,
    area && area.toLowerCase() !== `м.${settlement}`.toLowerCase()
      ? `${titleCase(area)} область`
      : null,
    region && `${titleCase(region)} район`,
    getSettlement,
    getStreet,
    building,
    apartment && `кв.${apartment}`
  ]
    .filter(Boolean)
    .slice(0, -1)
    .join(", ");
  if (!address) return null;
  return address;
};

export default getFullAddress;
