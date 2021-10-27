import { processEmailUsers } from "../../src/utils/process-email-users";
import { MOCK_AUTH } from "../fixtures";
import * as commonModule from "@esri/hub-common";
import { IAddOrInviteContext } from "../../src/types";
import { ArcGISRequestError } from "@esri/arcgis-rest-request";

describe("processEmailUsers: ", () => {
  let emailOrgUsersSpy: jasmine.Spy;

  beforeEach(() => {
    emailOrgUsersSpy = spyOn(commonModule, "emailOrgUsers");
  });
  afterEach(() => {
    emailOrgUsersSpy.calls.reset();
  });
  it("flows through happy path...", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [
        { orgType: "community", username: "bob" },
        { orgType: "community", username: "frank" },
      ],
      canAutoAddUser: false,
      addUserAsGroupAdmin: false,
      email: { message: {}, auth: MOCK_AUTH },
      world: [],
      org: [],
      community: [
        { orgType: "community", username: "bob" },
        { orgType: "community", username: "frank" },
      ],
      partnered: [],
      collaborationCoordinator: [],
    };
    emailOrgUsersSpy.and.callFake(() => Promise.resolve({ success: true }));
    const result = await processEmailUsers(context);
    expect(emailOrgUsersSpy).toHaveBeenCalled();
    expect(emailOrgUsersSpy.calls.count()).toEqual(2);
    expect(result.users.length).toEqual(2);
    expect(result.notEmailed.length).toEqual(0);
    expect(result.errors.length).toEqual(0);
  });
  it("handles matters when success is false", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [
        { orgType: "community", username: "bob" },
        { orgType: "community", username: "frank" },
      ],
      canAutoAddUser: false,
      addUserAsGroupAdmin: false,
      email: { message: {}, auth: MOCK_AUTH },
      world: [],
      org: [],
      community: [
        { orgType: "community", username: "bob" },
        { orgType: "community", username: "frank" },
      ],
      partnered: [],
      collaborationCoordinator: [],
    };
    emailOrgUsersSpy.and.callFake(() => Promise.resolve({ success: false }));
    const result = await processEmailUsers(context);
    expect(emailOrgUsersSpy).toHaveBeenCalled();
    expect(emailOrgUsersSpy.calls.count()).toEqual(2);
    expect(result.users.length).toEqual(2);
    expect(result.notEmailed.length).toEqual(2);
    expect(result.errors.length).toEqual(0);
  });
  it("handles matters when errors are returned", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [
        { orgType: "community", username: "bob" },
        { orgType: "community", username: "frank" },
      ],
      canAutoAddUser: false,
      addUserAsGroupAdmin: false,
      email: { message: {}, auth: MOCK_AUTH },
      world: [],
      org: [],
      community: [
        { orgType: "community", username: "bob" },
        { orgType: "community", username: "frank" },
      ],
      partnered: [],
      collaborationCoordinator: [],
    };
    const error = new ArcGISRequestError("Email not sent");
    emailOrgUsersSpy.and.callFake(() =>
      Promise.resolve({ success: false, errors: [error] })
    );
    const result = await processEmailUsers(context);
    expect(emailOrgUsersSpy).toHaveBeenCalled();
    expect(emailOrgUsersSpy.calls.count()).toEqual(2);
    expect(result.users.length).toEqual(2, "two people in users array");
    expect(result.notEmailed.length).toEqual(2, "two people not emailed");
    expect(result.errors.length).toEqual(2, "two errors returned");
  });
});
