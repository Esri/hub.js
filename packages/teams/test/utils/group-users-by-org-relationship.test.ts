import { IUserWithOrgType } from "../../src/types";
import { groupUsersByOrgRelationship } from "../../src/utils/group-users-by-org-relationship";

describe("groupUsersByOrgRelationship: ", () => {
  it("properly groups users by org relationship", () => {
    const users: IUserWithOrgType[] = [
      { orgType: "world" },
      { orgType: "org" },
      { orgType: "community" },
      { orgType: "org" },
      { orgType: "partnered" },
      { orgType: "collaborationCoordinator" },
    ];
    const result = groupUsersByOrgRelationship(users);
    expect(result.world.length).toEqual(1);
    expect(result.org.length).toEqual(2);
    expect(result.community.length).toEqual(1);
    expect(result.partnered.length).toEqual(1);
    expect(result.collaborationCoordinator.length).toEqual(1);
  });
});
