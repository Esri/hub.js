import * as restPortalModule from "@esri/arcgis-rest-portal";
import {
  IAddMemberContext,
  IEmail,
} from "../../../../src/groups/add-users-workflow/interfaces";
import { _processSecondaryEmail } from "../../../../src/groups/add-users-workflow/output-processors/_process-secondary-email";
import * as emailModule from "../../../../src/groups/emailOrgUsers";
import * as isAdminModule from "../../../../src/groups/add-users-workflow/utils/_is-org-admin";
import { IHubRequestOptions } from "../../../../src/types";
import { cloneObject } from "../../../../src/util";
describe("_processSecondaryEmail", () => {
  const orgId = "Shermer High";
  const groupId = "Bueller Gang";
  const users: restPortalModule.IUser[] = [
    { username: "Ferris", orgId },
    { username: "Cameron", orgId },
    { username: "Sloane", orgId },
  ];

  const baseContext: IAddMemberContext = {
    groupId,
    allUsers: [],
    usersToAutoAdd: [],
    usersToEmail: [],
    usersToInvite: users,
    requestingUser: null,
    primaryRO: null,
  };

  let emailSpy: jasmine.Spy;
  let isOrgAdminSpy: jasmine.Spy;

  beforeEach(() => {
    emailSpy = spyOn(emailModule, "emailOrgUsers");
    emailSpy.and.callFake(() => Promise.resolve({ success: true }));

    isOrgAdminSpy = spyOn(isAdminModule, "_isOrgAdmin");
    isOrgAdminSpy.and.callFake(() => true);
  });

  afterEach(() => {
    emailSpy.calls.reset();
    isOrgAdminSpy.calls.reset();
  });

  it("Doesn't modify context if no email object provided", async () => {
    const context = cloneObject(baseContext);
    const result = await _processSecondaryEmail(context);
    expect(emailSpy).not.toHaveBeenCalled();
    expect(result).toEqual(baseContext);
  });

  it("Doesn't modify context if no secondaryRO object provided", async () => {
    const email: IEmail = {
      subject: "subject",
      body: "body",
    };
    const context = Object.assign(cloneObject(baseContext), {
      email: cloneObject(email),
    });
    const actual = await _processSecondaryEmail(context);
    const expected = Object.assign(cloneObject(baseContext), {
      email: cloneObject(email),
    });
    expect(emailSpy).not.toHaveBeenCalled();
    expect(actual).toEqual(expected);
  });

  it("Doesn't modify context if inviteResult is unsuccessful/non-existent", async () => {
    const email: IEmail = {
      subject: "subject",
      body: "body",
    };

    const secondaryRO: IHubRequestOptions = {
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
    const context = Object.assign(cloneObject(baseContext), {
      email: cloneObject(email),
      secondaryRO: cloneObject(secondaryRO),
    });
    const actual = await _processSecondaryEmail(context);
    const expected = Object.assign(cloneObject(baseContext), {
      email: cloneObject(email),
      secondaryRO: cloneObject(secondaryRO),
    });
    expect(emailSpy).not.toHaveBeenCalled();
    expect(actual).toEqual(expected);
  });

  it("Delegates to emailOrgUser and modifies the context object", async () => {
    const email: IEmail = {
      subject: "subject",
      body: "body",
    };

    const secondaryRO: IHubRequestOptions = {
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
    const secondaryEmailResult = { success: true };

    const context = Object.assign(cloneObject(baseContext), {
      email: cloneObject(email),
      secondaryRO: cloneObject(secondaryRO),
      inviteResult: cloneObject(inviteResult),
    });

    const expected = Object.assign(cloneObject(baseContext), {
      email: cloneObject(email),
      secondaryRO: cloneObject(secondaryRO),
      inviteResult: cloneObject(inviteResult),
      secondaryEmailResult: cloneObject(secondaryEmailResult),
    });
    const actual = await _processSecondaryEmail(context);

    expect(emailSpy).toHaveBeenCalledWith(
      users,
      context.email,
      context.secondaryRO.authentication,
      true
    );
    expect(actual).toEqual(expected);
  });
});
