import { guessTimeZone } from "../../../src/utils/date/guessTimeZone";

describe("guessTimeZone", () => {
  it("should return an IANA timezone string", () => {
    expect(guessTimeZone()).toEqual(jasmine.any(String));
  });
});
