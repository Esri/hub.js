import { groupIds } from "../../../../src/ago/helpers/filters/group-ids";

describe("groupIds filter test", () => {
  it("computes correct groupIds ago filter string", () => {
    const queryFilters = {
      groupIds: {
        terms: ["1ef", "2ef"]
      }
    };
    expect(groupIds(queryFilters)).toBe('(group:"1ef" OR group:"2ef")');
  });
});
