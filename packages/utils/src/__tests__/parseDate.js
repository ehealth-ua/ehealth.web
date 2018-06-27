import parseDate from "../parseDate";

describe("parseDate", () => {
  it("should parse empty string", () => {
    expect(parseDate("")).toBe("");
  });

  it("should parse day", () => {
    expect(parseDate("12")).toBe("12");
  });

  it("should parse day and half of month", () => {
    expect(parseDate("12.0")).toBe("0-12");
  });

  it("should parse day and month", () => {
    expect(parseDate("12.08")).toBe("08-12");
  });

  it("should parse day, month and half of year", () => {
    expect(parseDate("12.08.20")).toBe("20-08-12");
  });

  it("should parse day, month and year", () => {
    expect(parseDate("12.08.2012")).toBe("2012-08-12");
  });
});
