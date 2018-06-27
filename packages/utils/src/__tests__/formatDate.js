import formatDate from "../formatDate";

describe("formatDate", () => {
  it("should pass through non-string value", () => {
    expect(formatDate(null)).toBe(null);
  });

  it("should format empty string", () => {
    expect(formatDate("")).toBe("");
  });

  it("should format day", () => {
    expect(formatDate("12")).toBe("12");
  });

  it("should format day and half of month", () => {
    expect(formatDate("0-12")).toBe("12.0");
  });

  it("should format day and month", () => {
    expect(formatDate("08-12")).toBe("12.08");
  });

  it("should format day, month and half of year", () => {
    expect(formatDate("20-08-12")).toBe("12.08.20");
  });

  it("should format day, month and year", () => {
    expect(formatDate("2012-08-12")).toBe("12.08.2012");
  });
});
