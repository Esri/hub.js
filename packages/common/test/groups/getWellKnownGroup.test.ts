import { getWellKnownGroup } from "../../src/groups/getWellKnownGroup";
import {
  MOCK_CONTEXT,
  getMockContextWithPrivilenges,
} from "../mocks/mock-auth";

describe("getWellKnownGroup: ", () => {
  it("returns a followers group", () => {
    const resp = getWellKnownGroup("hubFollowersGroup", MOCK_CONTEXT);
    expect(resp).toEqual({
      type: "Group",
      access: "public",
      autoJoin: true,
      isInvitationOnly: false,
      isViewOnly: true,
      leavingDisallowed: false,
    });
  });
  it("returns a view group", () => {
    const resp = getWellKnownGroup("hubViewGroup", MOCK_CONTEXT);
    expect(resp).toEqual({
      type: "Group",
      access: "private",
      autoJoin: false,
      isSharedUpdate: false,
      isInvitationOnly: false,
      hiddenMembers: false,
      isViewOnly: false,
      leavingDisallowed: false,
      tags: ["Hub Group"],
      membershipAccess: "organization",
    });
  });
  it("returns a view group with membershipAccess set to anyone", () => {
    const resp = getWellKnownGroup(
      "hubViewGroup",
      getMockContextWithPrivilenges(["portal:user:addExternalMembersToGroup"])
    );
    expect(resp).toEqual({
      type: "Group",
      access: "private",
      autoJoin: false,
      isSharedUpdate: false,
      isInvitationOnly: false,
      hiddenMembers: false,
      isViewOnly: false,
      leavingDisallowed: false,
      tags: ["Hub Group"],
      membershipAccess: "anyone",
    });
  });
  it('returns a view group with access set to "org"', () => {
    const resp = getWellKnownGroup(
      "hubViewGroup",
      getMockContextWithPrivilenges(["portal:user:shareGroupToOrg"])
    );
    expect(resp).toEqual({
      type: "Group",
      access: "org",
      autoJoin: false,
      isSharedUpdate: false,
      isInvitationOnly: false,
      hiddenMembers: false,
      isViewOnly: false,
      leavingDisallowed: false,
      tags: ["Hub Group"],
      membershipAccess: "organization",
    });
  });
  it('returns a view group with access set to "public"', () => {
    const resp = getWellKnownGroup(
      "hubViewGroup",
      getMockContextWithPrivilenges(["portal:user:shareGroupToPublic"])
    );
    expect(resp).toEqual({
      type: "Group",
      access: "public",
      autoJoin: false,
      isSharedUpdate: false,
      isInvitationOnly: false,
      hiddenMembers: false,
      isViewOnly: false,
      leavingDisallowed: false,
      tags: ["Hub Group"],
      membershipAccess: "organization",
    });
  });
  it("returns an edit group", () => {
    const resp = getWellKnownGroup("hubEditGroup", MOCK_CONTEXT);
    expect(resp).toEqual({
      type: "Group",
      access: "org",
      autoJoin: false,
      isSharedUpdate: true,
      isInvitationOnly: false,
      hiddenMembers: false,
      isViewOnly: false,
      leavingDisallowed: false,
      tags: ["Hub Group"],
      membershipAccess: "organization",
    });
  });
  it("returns an edit group with membershipAccess set to collaborators", () => {
    const resp = getWellKnownGroup(
      "hubEditGroup",
      getMockContextWithPrivilenges(["portal:user:addExternalMembersToGroup"])
    );
    expect(resp).toEqual({
      type: "Group",
      access: "org",
      autoJoin: false,
      isSharedUpdate: true,
      isInvitationOnly: false,
      hiddenMembers: false,
      isViewOnly: false,
      leavingDisallowed: false,
      tags: ["Hub Group"],
      membershipAccess: "collaborators",
    });
  });

  it("returns an associations group", () => {
    const resp = getWellKnownGroup("hubAssociationsGroup", MOCK_CONTEXT);
    expect(resp).toEqual({
      type: "Group",
      access: "public",
      autoJoin: false,
      isInvitationOnly: false,
      isViewOnly: true,
      leavingDisallowed: false,
      membershipAccess: "organization",
      protected: true,
    });
  });

  it("returns an associations group with membershipAccess set to anyone", () => {
    const resp = getWellKnownGroup(
      "hubAssociationsGroup",
      getMockContextWithPrivilenges(["portal:user:addExternalMembersToGroup"])
    );
    expect(resp).toEqual({
      type: "Group",
      access: "public",
      autoJoin: false,
      isInvitationOnly: false,
      isViewOnly: true,
      leavingDisallowed: false,
      membershipAccess: "anyone",
      protected: true,
    });
  });
});
