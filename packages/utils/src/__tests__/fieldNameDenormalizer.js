import fieldNameDenormalizer from "../fieldNameDenormalizer";
import fieldNameNormalizer from "../fieldNameNormalizer";

describe("fieldNameDenormalizer", () => {
  it("should convert camelCase to snake_case", () => {
    expect(fieldNameDenormalizer("someTextFromDb")).toBe("some_text_from_db");
  });

  it("shouldn't convert something that is not camelCase to snake_case", () => {
    expect(fieldNameNormalizer("SOME_TEXT")).toBe("SOME_TEXT");
  });
});
