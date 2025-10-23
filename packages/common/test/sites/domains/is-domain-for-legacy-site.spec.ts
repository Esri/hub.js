import { IDomainEntry } from "../../../src/hub-types";
import { isDomainForLegacySite } from "../../../src/sites/domains/is-domain-for-legacy-site";
import {
  describe,
  it,
  expect,
} from "vitest";

describe("isDomainForLegacySite", function () {
  it("identifies legacy domain entries", function () {
    const normalRecord = {
      siteId: "042584cf391c428e995e97eccdebb8f8",
    } as IDomainEntry;
    const legacyRecord = {
      siteId: "1234asdf",
    } as IDomainEntry;

    expect(isDomainForLegacySite(normalRecord)).toBeFalsy();
    expect(isDomainForLegacySite(legacyRecord)).toBeTruthy();
  });
});
