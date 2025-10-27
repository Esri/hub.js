import { _ensureSafeDomainLength } from "../../../src/sites/domains/_ensure-safe-domain-length";
import * as generateRandomStringModule from "../../../src/utils/generate-random-string";
import {
  describe,
  it,
  expect,
  afterEach,
  vi,
} from "vitest";

describe("_ensureSafeDomainLength", () => {
  afterEach(() => vi.restoreAllMocks());
  it("shortens domain and appends random hash if necessary", async () => {
    vi.spyOn(
      generateRandomStringModule,
      "generateRandomString"
    ).mockReturnValue("abcde" as any);

    expect(_ensureSafeDomainLength("short-domain")).toBe(
      "short-domain",
      "doesnt touch a domain less than 64 chars long"
    );

    const domainWith64Chars =
      "0123456789012345678901234567890123456789012345678901234567890123";
    expect(domainWith64Chars.length).toBe(64, "set up the test correctly");

    const shortened = _ensureSafeDomainLength(domainWith64Chars);
    expect(shortened).toBe(
      "012345678901234567890123456789012345678901234567890123456-abcde"
    );
    expect(shortened.length).toBe(63);
  });

  it("takes into account url key", async () => {
    vi.spyOn(
      generateRandomStringModule,
      "generateRandomString"
    ).mockReturnValue("abcde" as any);

    const domainWith58Chars =
      "0123456789012345678901234567890123456789012345678901234567";
    expect(domainWith58Chars.length).toBe(58, "set up the test correctly");

    expect(_ensureSafeDomainLength(domainWith58Chars)).toBe(
      domainWith58Chars,
      "doesnt touch domain when no url key"
    );
    expect(_ensureSafeDomainLength(domainWith58Chars, "1234")).toBe(
      domainWith58Chars,
      "doesnt touch domain when url key doesnt push it over the limit"
    );

    const shortened = _ensureSafeDomainLength(domainWith58Chars, "12345");
    expect(shortened).toBe(
      "012345678901234567890123456789012345678901234567890-abcde"
    );
    expect(shortened.length).toBe(57);
  });
});
