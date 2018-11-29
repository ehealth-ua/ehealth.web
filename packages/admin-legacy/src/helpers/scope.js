import { getCookie } from "@ehealth/utils";

export const hasScope = (scopeA = "", scopeB = "") => {
  const scopeAArr = !Array.isArray(scopeA) ? scopeA.split(" ") : scopeA;
  const scopeBArr = !Array.isArray(scopeB) ? scopeB.split(" ") : scopeB;
  return scopeAArr.some(scope => scopeBArr.includes(scope));
};

export const getScope = () => JSON.parse(getCookie("meta")).scope;
