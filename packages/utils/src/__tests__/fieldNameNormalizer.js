import fieldNameNormalizer from "../fieldNameNormalizer";

describe("fieldNameNormalizer", () => {
  it("should convert snake_case to camelCase", () => {
    expect(fieldNameNormalizer("some_text_from_db")).toBe("someTextFromDb");
  });
});
