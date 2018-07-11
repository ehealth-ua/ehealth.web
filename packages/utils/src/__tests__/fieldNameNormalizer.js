import fieldNameNormalizer from "../fieldNameNormalizer";

describe("fieldNameNormalizer", () => {
  it("should convert snake_case to camelCase", () => {
    expect(fieldNameNormalizer("some_text_from_db")).toBe("someTextFromDb");
  });

  it("shouldn't convert something that is not snake_case to camelCase", () => {
    expect(fieldNameNormalizer("SOME_TEXT")).toBe("SOME_TEXT");
  });
});
