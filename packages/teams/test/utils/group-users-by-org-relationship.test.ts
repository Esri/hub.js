import { IUserModalObject } from "../../src/types";
import { groupUsersByOrgRelationship } from "../../src/utils/group-users-by-org-relationship";

describe("groupUsersByOrgRelationship: ", () => {
  it("properly groups users by org relationship", () => {
    const users: IUserModalObject[] = [
      { modelType: "world" },
      { modelType: "org" },
      { modelType: "community" },
      {},
      {},
      { modelType: "org" },
    ];
    const result = groupUsersByOrgRelationship(users);
    expect(result.world.length).toEqual(3);
    expect(result.org.length).toEqual(2);
    expect(result.community.length).toEqual(1);
  });
});
