import getFullName from "../getFullName";

describe("getFullName", () => {
  it("should pass through object with full data", () => {
    expect(
      getFullName({
        firstName: "Іван",
        secondName: "Іванович",
        lastName: "Шевченко"
      })
    ).toBe("Шевченко Іван Іванович");
  });
  it("should pass through object with firstName and lastName", () => {
    expect(
      getFullName({
        firstName: "Іван",
        lastName: "Шевченко"
      })
    ).toBe("Шевченко Іван");
  });
  it("should pass through object with firstName and secondName", () => {
    expect(
      getFullName({
        firstName: "Іван",
        secondName: "Іванович"
      })
    ).toBe("Іван Іванович");
  });
});
