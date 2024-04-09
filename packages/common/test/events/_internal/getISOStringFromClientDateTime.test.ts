import { getISOStringFromClientDateTime } from "../../../src/events/_internal/getISOStringFromClientDateTime";

describe("getISOStringFromLocalDateTime", () => {
  it("it returns the expected UTC strings", () => {
    expect(getISOStringFromClientDateTime("2024-03-29", "12:00:00")).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}\:\d{2}\.\d{3}Z$/
    );
  });
});
