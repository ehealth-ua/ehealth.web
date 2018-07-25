import stringifySearchParams from "../stringifySearchParams";

describe("stringifySearchParams", () => {
  it("should return query string from deep object", () => {
    expect(
      stringifySearchParams({
        settlement: {
          settlement: "Kyiv",
          settlementType: "VILLAGE",
          region: "Kyivskya oblast"
        }
      })
    ).toBe(
      "settlement.settlement=Kyiv&settlement.settlementType=VILLAGE&settlement.region=Kyivskya+oblast"
    );
  });
  it("should return query string from object", () => {
    expect(
      stringifySearchParams({
        settlement: "Kyiv",
        settlementType: "VILLAGE",
        region: "Kyivskya oblast"
      })
    ).toBe("settlement=Kyiv&settlementType=VILLAGE&region=Kyivskya+oblast");
  });
  it("must pass through an object with incomplete data", () => {
    expect(
      stringifySearchParams({
        settlement: "Kyiv",
        settlementType: null,
        region: null
      })
    ).toBe("settlement=Kyiv");
  });
  it("must pass through an object with empty strings", () => {
    expect(
      stringifySearchParams({
        settlement: "Kyiv",
        settlementType: "",
        region: ""
      })
    ).toBe("settlement=Kyiv&settlementType=&region=");
  });
  it("should pass through empty object", () => {
    expect(stringifySearchParams({})).toBe("");
  });
});
