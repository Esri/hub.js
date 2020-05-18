import { _ensureSafeDomainLength } from "../../src";
import * as commonModule from "@esri/hub-common";

describe("_ensureSafeDomainLength", () => {
  it("shortens domain and appends random hash if necessary", async () => {
    spyOn(commonModule, "generateRandomString").and.returnValue("abcde");

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
    spyOn(commonModule, "generateRandomString").and.returnValue("abcde");

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
