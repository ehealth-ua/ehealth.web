import isUuidValid from "./uuid";

describe("UUID validator", () => {
  it("Incorrect param.", () => {
    expect(isUuidValid(true)).toBeFalsy();
    expect(isUuidValid(null)).toBeFalsy();
    expect(isUuidValid("")).toBeFalsy();
    expect(isUuidValid(123)).toBeFalsy();
    expect(isUuidValid(["da"])).toBeFalsy();
    expect(isUuidValid({ test: 1 })).toBeFalsy();
    expect(isUuidValid("1-2-3-4-5")).toBeFalsy();
  });

  it("Almost correct param.", () => {
    expect(isUuidValid("9d8d361-0892-42ec-beac-c582b5709dd4")).toBeFalsy();
    expect(isUuidValid("39d8d361-0892-42ec-beac-c582b5709dO4")).toBeFalsy();
    expect(isUuidValid("39D8D361-0892-42EC-BEAC-C582B5709DD4")).toBeFalsy();
  });

  it("Correct param.", () => {
    expect(isUuidValid("39d8d361-0892-42ec-beac-c582b5709dd4")).toBeTruthy();
    expect(isUuidValid("ca9b152c-8cd3-4fc5-9789-e82e55ede00b")).toBeTruthy();
    expect(isUuidValid("ae2d58a9-1c5e-4298-b57c-298749542c2f")).toBeTruthy();
  });
});
