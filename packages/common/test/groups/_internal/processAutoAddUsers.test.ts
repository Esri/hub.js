import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import { processAutoAddUsers } from "../../../src/groups/_internal/processAutoAddUsers";
import {
  IAddOrInviteContext,
  IAddOrInviteEmail,
  IAddOrInviteResponse,
} from "../../../src/groups/types";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import * as autoAddUsersAsAdminsModule from "../../../src/groups/_internal/autoAddUsersAsAdmins";
import * as processEmailUsersModule from "../../../src/groups/_internal/processEmailUsers";
import * as autoAddUsersModule from "../../../src/groups/autoAddUsers";

describe("processAutoAddUsers: ", () => {
  let autoAddUsersSpy: jasmine.Spy;
  let autoAddUsersAsAdminsSpy: jasmine.Spy;
  let processEmailUsersSpy: jasmine.Spy;

  beforeEach(() => {
    autoAddUsersSpy = spyOn(autoAddUsersModule, "autoAddUsers");
    autoAddUsersAsAdminsSpy = spyOn(
      autoAddUsersAsAdminsModule,
      "autoAddUsersAsAdmins"
    );
    processEmailUsersSpy = spyOn(processEmailUsersModule, "processEmailUsers");
  });
  afterEach(() => {
    autoAddUsersSpy.calls.reset();
    autoAddUsersAsAdminsSpy.calls.reset();
    processEmailUsersSpy.calls.reset();
  });

  it("flows through happy path as admin without email", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [
        { orgType: "org", username: "bob" },
        { orgType: "org", username: "frank" },
      ],
      canAutoAddUser: false,
      addUserAsGroupAdmin: true,
      email: undefined as unknown as IAddOrInviteEmail,
      world: [],
      org: [
        { orgType: "org", username: "bob" },
        { orgType: "org", username: "frank" },
      ],
      community: [],
      partnered: [],
      collaborationCoordinator: [],
    };
    autoAddUsersSpy.and.callFake(() => Promise.resolve({ success: true }));
    autoAddUsersAsAdminsSpy.and.callFake(() =>
      Promise.resolve({ success: true })
    );
    const result = await processAutoAddUsers(context, "org");
    expect(autoAddUsersAsAdminsSpy).toHaveBeenCalled();
    expect(autoAddUsersSpy).not.toHaveBeenCalled();
    expect(result.users.length).toEqual(2);
    expect(result.notAdded.length).toEqual(0);
    expect(result.errors.length).toEqual(0);
    expect(result.notEmailed.length).toEqual(0);
  });
  it("flows through happy path not as admin without email", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [
        { orgType: "org", username: "bob" },
        { orgType: "org", username: "frank" },
      ],
      canAutoAddUser: false,
      addUserAsGroupAdmin: false,
      email: undefined as unknown as IAddOrInviteEmail,
      world: [],
      org: [
        { orgType: "org", username: "bob" },
        { orgType: "org", username: "frank" },
      ],
      community: [],
      partnered: [],
      collaborationCoordinator: [],
    };
    autoAddUsersSpy.and.callFake(() => Promise.resolve({ success: true }));
    autoAddUsersAsAdminsSpy.and.callFake(() =>
      Promise.resolve({ success: true })
    );
    const result = await processAutoAddUsers(context, "org");
    expect(autoAddUsersAsAdminsSpy).not.toHaveBeenCalled();
    expect(autoAddUsersSpy).toHaveBeenCalled();
    expect(result.users.length).toEqual(2);
    expect(result.notAdded.length).toEqual(0);
    expect(result.errors.length).toEqual(0);
    expect(result.notEmailed.length).toEqual(0);
  });
  it("flows through happy path not as admin with email", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [
        { orgType: "org", username: "bob" },
        { orgType: "org", username: "frank" },
      ],
      canAutoAddUser: false,
      addUserAsGroupAdmin: false,
      email: { message: {}, auth: MOCK_AUTH },
      world: [],
      org: [
        { orgType: "org", username: "bob" },
        { orgType: "org", username: "frank" },
      ],
      community: [],
      partnered: [],
      collaborationCoordinator: [],
    };
    autoAddUsersSpy.and.callFake(() => Promise.resolve({ success: true }));
    autoAddUsersAsAdminsSpy.and.callFake(() =>
      Promise.resolve({ success: true })
    );
    processEmailUsersSpy.and.callFake(() => {
      const responseObj: IAddOrInviteResponse = {
        users: [],
        notEmailed: [],
        errors: [],
        notInvited: [],
        notAdded: [],
      };
      return Promise.resolve(responseObj);
    });
    const result = await processAutoAddUsers(context, "org", true);
    expect(autoAddUsersAsAdminsSpy).not.toHaveBeenCalled();
    expect(autoAddUsersSpy).toHaveBeenCalled();
    expect(processEmailUsersSpy).toHaveBeenCalled();
    expect(result.users.length).toEqual(2);
    expect(result.notAdded.length).toEqual(0);
    expect(result.errors.length).toEqual(0);
    expect(result.notEmailed.length).toEqual(0);
  });
  it("handles errors", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [
        { orgType: "org", username: "bob" },
        { orgType: "org", username: "frank" },
      ],
      canAutoAddUser: false,
      addUserAsGroupAdmin: false,
      email: { message: {}, auth: MOCK_AUTH },
      world: [],
      org: [
        { orgType: "org", username: "bob" },
        { orgType: "org", username: "frank" },
      ],
      community: [],
      partnered: [],
      collaborationCoordinator: [],
    };
    const error = new ArcGISRequestError("Email not sent");
    autoAddUsersSpy.and.callFake(() =>
      Promise.resolve({ notAdded: ["bob", "frank"], errors: [error] })
    );
    autoAddUsersAsAdminsSpy.and.callFake(() =>
      Promise.resolve({ success: true })
    );
    processEmailUsersSpy.and.callFake(() => {
      const responseObj: IAddOrInviteResponse = {
        users: ["bob", "frank"],
        notEmailed: ["bob", "frank"],
        errors: [error, error],
        notInvited: [],
        notAdded: [],
      };
      return Promise.resolve(responseObj);
    });
    const result = await processAutoAddUsers(context, "org", true);
    expect(autoAddUsersAsAdminsSpy).not.toHaveBeenCalled();
    expect(autoAddUsersSpy).toHaveBeenCalled();
    expect(processEmailUsersSpy).toHaveBeenCalled();
    expect(result.users.length).toEqual(2);
    expect(result.notAdded.length).toEqual(2);
    expect(result.errors.length).toEqual(3);
    expect(result.notEmailed.length).toEqual(2);
  });
});
