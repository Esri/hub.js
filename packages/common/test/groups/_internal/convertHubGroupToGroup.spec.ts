import {
  describe,
  it,
  expect,
  beforeEach,
} from "vitest";
import { convertHubGroupToGroup } from "../../../src/groups/_internal/convertHubGroupToGroup";
import { IHubGroup } from "../../../src/core/types/IHubGroup";

describe("groups: convertHubGroupToHubGroup:", () => {
  let hubGroup: any;
  beforeEach(() => {
    hubGroup = {
      id: "3ef",
      access: "org",
      canEdit: true,
      name: "Test group",
      thumbnail: "group.jpg",
      membershipAccess: "collaborators",
      isSharedUpdate: true,
      _join: "invite",
    } as unknown as IHubGroup;
  });
  it("converts an HubGroup with _join === invite to a IGroup", async () => {
    const chk = convertHubGroupToGroup(hubGroup);
    // we convert some props in HubGroup to something else
    // in IGroup, checking them is a good way to
    // varify the HubGroup -> IGroup convertion
    expect(chk.id).toBe("3ef");
    expect(chk.access).toBe("org");
    expect(chk.membershipAccess).toBe("collaboration");
    expect(chk.capabilities).toBe("updateitemcontrol");
    expect(chk.isInvitationOnly).toBe(true);
    expect(chk.autoJoin).toBe(false);
  });
  it("converts an HubGroup with _join === request to a IGroup", async () => {
    const chk = convertHubGroupToGroup({ ...hubGroup, _join: "request" });
    // we convert some props in HubGroup to something else
    // in IGroup, checking them is a good way to
    // varify the HubGroup -> IGroup convertion
    expect(chk.id).toBe("3ef");
    expect(chk.access).toBe("org");
    expect(chk.membershipAccess).toBe("collaboration");
    expect(chk.capabilities).toBe("updateitemcontrol");
    expect(chk.isInvitationOnly).toBe(false);
    expect(chk.autoJoin).toBe(false);
  });
  it("converts an HubGroup with _join === auto to a IGroup", async () => {
    const chk = convertHubGroupToGroup({ ...hubGroup, _join: "auto" });
    // we convert some props in HubGroup to something else
    // in IGroup, checking them is a good way to
    // varify the HubGroup -> IGroup convertion
    expect(chk.id).toBe("3ef");
    expect(chk.access).toBe("org");
    expect(chk.membershipAccess).toBe("collaboration");
    expect(chk.capabilities).toBe("updateitemcontrol");
    expect(chk.isInvitationOnly).toBe(false);
    expect(chk.autoJoin).toBe(true);
  });
  it("clears empty fields", async () => {
    hubGroup.membershipAccess = "anyone";
    const chk = convertHubGroupToGroup(hubGroup);
    expect(chk.id).toBe("3ef");
    expect(chk.membershipAccess).toBeFalsy();
    expect(chk._clearEmptyFields).toBeTruthy();
  });
});
