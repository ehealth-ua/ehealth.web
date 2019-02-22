import normalizeErrors from "../normalizeErrors";

const errors = [
  {
    message: "Root message",
    locations: {},
    path: [],
    extensions: {
      code: "UNPROCESSABLE_ENTITY",
      exception: {
        inputErrors: [
          {
            message: "Foo {bar} baz!",
            options: { bar: "hello" },
            path: ["settlement"]
          }
        ]
      }
    }
  }
];

const complicatedErrors = [
  {
    message: "Root message",
    locations: {},
    path: [],
    extensions: {
      code: "UNPROCESSABLE_ENTITY",
      exception: {
        inputErrors: [
          {
            message: "Foo {bar} baz!",
            options: { bar: "hello" },
            path: ["UNPROCESSABLE_ENTITY", "address", "settlement"]
          },
          {
            message: "Foo {bar} baz!",
            options: { bar: "hello" },
            path: ["UNPROCESSABLE_ENTITY", "address", "area"]
          }
        ]
      }
    }
  },
  {
    message: "Root message",
    locations: {},
    path: [],
    extensions: {
      code: "CONFLICT",
      exception: {
        inputErrors: [
          {
            message: "Foo {bar} baz!",
            options: { bar: "hello" },
            path: ["CONFLICT"]
          }
        ]
      }
    }
  }
];

describe("normalizeErrors", () => {
  it("should return object", () => {
    expect(normalizeErrors(errors)).toEqual({
      settlement: {
        message: "Foo {bar} baz!",
        options: { bar: "hello" }
      }
    });
  });
  it("should return embedded object", () => {
    expect(normalizeErrors(errors, "filter")).toEqual({
      filter: {
        settlement: {
          message: "Foo {bar} baz!",
          options: { bar: "hello" }
        }
      }
    });
  });
  it("should return deep embedded object", () => {
    expect(normalizeErrors(errors, "filter.area")).toEqual({
      filter: {
        area: {
          settlement: {
            message: "Foo {bar} baz!",
            options: { bar: "hello" }
          }
        }
      }
    });
  });
  it("should return deep embedded object", () => {
    expect(normalizeErrors(errors, "filter.area")).toEqual({
      filter: {
        area: {
          settlement: {
            message: "Foo {bar} baz!",
            options: { bar: "hello" }
          }
        }
      }
    });
  });
  it("should return complicated object", () => {
    expect(normalizeErrors(complicatedErrors)).toEqual({
      UNPROCESSABLE_ENTITY: {
        address: {
          settlement: {
            message: "Foo {bar} baz!",
            options: { bar: "hello" }
          },
          area: {
            message: "Foo {bar} baz!",
            options: { bar: "hello" }
          }
        }
      },
      CONFLICT: {
        message: "Foo {bar} baz!",
        options: {
          bar: "hello"
        }
      }
    });
  });
  it("should return complicated embedded object", () => {
    expect(normalizeErrors(complicatedErrors, "filter.user")).toEqual({
      filter: {
        user: {
          UNPROCESSABLE_ENTITY: {
            address: {
              settlement: {
                message: "Foo {bar} baz!",
                options: { bar: "hello" }
              },
              area: {
                message: "Foo {bar} baz!",
                options: { bar: "hello" }
              }
            }
          },
          CONFLICT: {
            message: "Foo {bar} baz!",
            options: {
              bar: "hello"
            }
          }
        }
      }
    });
  });
});
