import * as getUniqueTitleModule from "../../src/utils/get-unique-group-title";
import * as portalModule from "@esri/arcgis-rest-portal";
import { IHubRequestOptions, cloneObject } from "@esri/hub-common";
import { IGroupTemplate } from "../../src/types";
import { _createTeamGroup } from "../../src/utils/_create-team-group";
import { IUser } from "@esri/arcgis-rest-auth";
import { IPortal } from "@esri/arcgis-rest-portal";

describe("_createTeamGroup", () => {
  const user = {
    username: "andrew",
    privileges: ["portal:user:createGroup"]
  } as IUser;
  const ro = {
    authentication: { token: "foobar" },
    portalSelf: ({
      canSharePublic: true
    } as unknown) as IPortal
  } as IHubRequestOptions;

  it("should create team group correctly", async () => {
    const groupId = "foobarbaz";
    const createSpy = spyOn(portalModule, "createGroup").and.returnValue(
      Promise.resolve({ success: true, group: { id: groupId } })
    );
    const protectSpy = spyOn(portalModule, "protectGroup").and.returnValue(
      Promise.resolve()
    );
    const getUniqueSpy = spyOn(
      getUniqueTitleModule,
      "getUniqueGroupTitle"
    ).and.callFake((title: string) => Promise.resolve(title + " 2"));

    const groupTemplate = {
      title: "some-group-title",
      access: "public"
    } as IGroupTemplate;

    const res = await _createTeamGroup(user, cloneObject(groupTemplate), ro);

    expect(res.id).toBe(groupId, "attaches group id");
    expect(res.userMembership).toEqual(
      {
        username: user.username,
        memberType: "owner",
        applications: 0
      },
      "attaches group membership"
    );

    expect(getUniqueSpy.calls.argsFor(0)[0]).toBe(
      groupTemplate.title,
      "getUniqueGroupTitle called with group title"
    );

    // Create group stuff
    const createArgGroup = createSpy.calls.argsFor(0)[0].group;
    expect(createArgGroup.title).toBe(
      "some-group-title 2",
      "createGroup called with unique title"
    );
    expect(createArgGroup.access).toBe(
      "private",
      "createGroup called with adjusted group access"
    );
    const createArgAuth = createSpy.calls.argsFor(0)[0].authentication;
    expect(createArgAuth).toEqual(
      ro.authentication,
      "authentication attached to create call"
    );

    // Protect group
    expect(protectSpy.calls.argsFor(0)[0].id).toBe(
      groupId,
      "protect spy called with correct group id"
    );
    expect(protectSpy.calls.argsFor(0)[0].authentication).toBe(
      ro.authentication,
      "user auth attached"
    );
  });

  it("should reject if error", async () => {
    spyOn(portalModule, "createGroup").and.returnValue(
      Promise.reject({ success: false })
    ); // make it fail
    spyOn(getUniqueTitleModule, "getUniqueGroupTitle").and.callFake(
      (title: string) => Promise.resolve(title + " 2")
    );
    const protectSpy = spyOn(portalModule, "protectGroup").and.returnValue(
      Promise.resolve()
    );

    const groupTemplate = {
      title: "some-group-title",
      access: "public"
    } as IGroupTemplate;

    try {
      await _createTeamGroup(user, cloneObject(groupTemplate), ro);
      fail("should reject");
    } catch (err) {
      expect(err).toBeDefined();
    }

    expect(protectSpy).not.toHaveBeenCalled();
  });
});
