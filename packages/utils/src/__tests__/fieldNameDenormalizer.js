import fieldNameDenormalizer from "../fieldNameDenormalizer";

describe("fieldNameDenormalizer", () => {
  it("should convert camelCase to snake_case", () => {
    expect(fieldNameDenormalizer("someTextFromDb")).toBe("some_text_from_db");
  });
});
