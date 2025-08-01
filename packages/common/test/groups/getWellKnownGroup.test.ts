import { getWellKnownGroup } from "../../src/groups/getWellKnownGroup";
import { MOCK_CONTEXT, MOCK_AUTH } from "../mocks/mock-auth";
import { ArcGISContext } from "../../src/ArcGISContext";
import type { IArcGISContext } from "../../src";

describe("getWellKnownGroup: ", () => {
  const MOCK_CONTEXT_WITH_PRIVILEGES = new ArcGISContext({
    id: 123,
    currentUser: {
      username: "mock_user",
      favGroupId: "456abc",
      orgId: "789def",
      privileges: ["portal:user:addExternalMembersToGroup"],
    },
    portalUrl: "https://qaext.arcgis.com",
    hubUrl: "https://hubqa.arcgis.com",
    authentication: MOCK_AUTH,
    portalSelf: {
      id: "123",
      name: "My org",
      isPortal: false,
      urlKey: "www",
    },
    serviceStatus: {
      portal: "online",
      discussions: "online",
      events: "online",
      metrics: "online",
      notifications: "online",
      "hub-search": "online",
      domains: "online",
      "hub-downloads": "online",
      "hub-ai-assistant": "online",
    },
    userHubSettings: {
      schemaVersion: 1,
    },
  }) as IArcGISContext;
  it("returns a followers group", () => {
    const resp = getWellKnownGroup("hubFollowersGroup", MOCK_CONTEXT);
    expect(resp).toEqual({
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
  it("returns a view group with membershipAccess set to anyone", () => {
    const resp = getWellKnownGroup(
      "hubViewGroup",
      MOCK_CONTEXT_WITH_PRIVILEGES
    );
    expect(resp).toEqual({
      access: "org",
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
  it("returns an edit group", () => {
    const resp = getWellKnownGroup("hubEditGroup", MOCK_CONTEXT);
    expect(resp).toEqual({
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
      MOCK_CONTEXT_WITH_PRIVILEGES
    );
    expect(resp).toEqual({
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
      MOCK_CONTEXT_WITH_PRIVILEGES
    );
    expect(resp).toEqual({
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
