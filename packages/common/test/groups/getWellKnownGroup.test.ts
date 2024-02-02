import { getWellKnownGroup } from "../../src/groups/getWellKnownGroup";
import { WellKnownGroups } from "../../src/groups/_internal/WellKnownGroups";

describe("getWellKnownGroup: ", () => {
  it("returns a well known group template based on a name", () => {
    Object.keys(WellKnownGroups).forEach((key) => {
      const result = getWellKnownGroup(key as keyof typeof WellKnownGroups);
      expect(result).toEqual(
        WellKnownGroups[key as keyof typeof WellKnownGroups]
      );
    });
  });
});
