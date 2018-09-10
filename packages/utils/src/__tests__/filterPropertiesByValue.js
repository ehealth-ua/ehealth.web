import filterPropertiesByValue from "../filterPropertiesByValue";

describe("filterPropertiesByValue", () => {
  it("should return data without empty values", () => {
    const data = { a: "", b: null, c: "some value" };
    expect(filterPropertiesByValue(data, "")).toEqual({
      b: null,
      c: "some value"
    });
  });

  it("should return data (include object inside) without empty values", () => {
    const data = { a: { a: "", b: "some value" }, b: null, c: "some value" };
    expect(filterPropertiesByValue(data, "")).toEqual({
      a: { b: "some value" },
      b: null,
      c: "some value"
    });
  });

  it("should return data (include object inside) without empty values", () => {
    const data = {
      a: [[1, 3], 1, { a1: "", a2: "some value" }],
      b: null,
      c: "some value"
    };
    expect(filterPropertiesByValue(data, "")).toEqual({
      a: [[1, 3], 1, { a2: "some value" }],
      b: null,
      c: "some value"
    });
  });

  it("should return data (include Array inside) without empty values", () => {
    const data = {
      a: {
        a: [
          {
            key3: "",
            key4: "value4",
            key5: [{ key51: "", key52: "value52" }]
          },
          {
            key3: "",
            key4: "value4",
            key5: [{ key51: "", key52: "value52" }]
          }
        ],
        b: "some value",
        c: ""
      },
      b: null,
      c: "some value",
      d: "",
      e: { f: "", g: "" }
    };
    expect(filterPropertiesByValue(data, "")).toEqual({
      a: {
        a: [
          {
            key4: "value4",
            key5: [{ key52: "value52" }]
          },
          {
            key4: "value4",
            key5: [{ key52: "value52" }]
          }
        ],
        b: "some value"
      },
      b: null,
      c: "some value",
      e: {}
    });
  });
});
