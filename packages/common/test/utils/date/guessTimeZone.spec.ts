import { describe, it, expect } from "vitest";
import { guessTimeZone } from "../../../src/utils/date/guessTimeZone";

describe("guessTimeZone", () => {
  it("should return an IANA timezone string", () => {
    expect(guessTimeZone()).toEqual(expect.any(String));
  });
});
