import * as restPortalModule from "@esri/arcgis-rest-portal";
import {
  cloneObject,
  IAddMemberContext,
  IEmail,
  IHubRequestOptions,
} from "../../../../src";
import { _processPrimaryEmail } from "../../../../src/groups/add-users-workflow/output-processors/_process-primary-email";
import * as emailModule from "../../../../src/groups/emailOrgUsers";
import * as isAdminModule from "../../../../src/groups/add-users-workflow/utils/_is-org-admin";
describe("_processPrimaryEmail", () => {
  const orgId = "the_swamp";
  const groupId = "The Gang";
  const users: restPortalModule.IUser[] = [
    { username: "Shrek", orgId },
    { username: "Fiona", orgId },
    { username: "Donkey", orgId },
  ];

  const baseContext: IAddMemberContext = {
    groupId,
    allUsers: [],
    usersToAutoAdd: [],
    usersToEmail: users,
    usersToInvite: [],
    requestingUser: null,
    primaryRO: null,
  };

  let emailSpy: jasmine.Spy;
  let isOrgAdminSpy: jasmine.Spy;

  beforeEach(() => {
    emailSpy = spyOn(emailModule, "emailOrgUsers");
    emailSpy.and.callFake(() => Promise.resolve({ success: true }));

    isOrgAdminSpy = spyOn(isAdminModule, "_isOrgAdmin");
    isOrgAdminSpy.and.returnValue(true);
  });

  afterEach(() => {
    emailSpy.calls.reset();
    isOrgAdminSpy.calls.reset();
  });

  it("Doesn't modify context if no email object provided", async () => {
    const context = cloneObject(baseContext);
    const result = await _processPrimaryEmail(context);
    expect(emailSpy).not.toHaveBeenCalled();
    expect(result).toEqual(baseContext);
  });

  it("Doesn't modify context if inviteResult is unsuccessful/non-existent", async () => {
    const email: IEmail = {
      subject: "subject",
      body: "body",
    };

    const context = Object.assign(cloneObject(baseContext), {
      email: cloneObject(email),
    });
    const actual = await _processPrimaryEmail(context);
    const expected = Object.assign(cloneObject(baseContext), {
      email: cloneObject(email),
    });
    expect(emailSpy).not.toHaveBeenCalled();
    expect(actual).toEqual(expected);
  });

  it("Delegates to emailOrgUser and modifies the context object", async () => {
    const email: IEmail = {
      subject: "subject",
      body: "body",
    };

    const primaryRO: IHubRequestOptions = {
      isPortal: false,
      authentication: null,
      hubApiUrl: "what url",
      portalSelf: {
        isPortal: false,
        id: "portalId",
        name: "a name",
        user: { username: "Mr. Rooney", orgId },
      },
    };

    const inviteResult = { success: true };
    const primaryEmailResult = { success: true };

    const context = Object.assign(cloneObject(baseContext), {
      email: cloneObject(email),
      primaryRO: cloneObject(primaryRO),
      inviteResult: cloneObject(inviteResult),
    });

    const expected = Object.assign(cloneObject(baseContext), {
      email: cloneObject(email),
      primaryRO: cloneObject(primaryRO),
      inviteResult: cloneObject(inviteResult),
      primaryEmailResult: cloneObject(primaryEmailResult),
    });
    const actual = await _processPrimaryEmail(context);

    expect(emailSpy).toHaveBeenCalledWith(
      context.usersToEmail,
      context.email,
      context.primaryRO.authentication,
      true
    );
    expect(actual).toEqual(expected);
  });
});
