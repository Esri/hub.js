import * as restPortalModule from "@esri/arcgis-rest-portal";
import { emailOrgUsers } from "../../src/groups/emailOrgUsers";
import { IEmail } from "../../src/groups/types";
import { MOCK_AUTH } from "./add-users-workflow/fixtures";

describe("email-org-users", function () {
  let notificationSpy: jasmine.Spy;
  const users: restPortalModule.IUser[] = [
    { username: "huey" },
    { username: "dewey" },
    { username: "louie" },
  ];
  const email: IEmail = {
    subject: "subject",
    body: "body",
  };

  beforeEach(() => {
    notificationSpy = spyOn(restPortalModule, "createOrgNotification");
  });
  afterEach(() => {
    notificationSpy.calls.reset();
  });

  it("Properly delegates to createOrgNotification", async () => {
    notificationSpy.and.callFake(() => Promise.resolve({ success: true }));
    const result = await emailOrgUsers(users, email, MOCK_AUTH, true);
    expect(result).toEqual({ success: true });
    expect(notificationSpy).toHaveBeenCalled();
    const actualArgs = notificationSpy.calls.first().args;
    const expectedArgs = [
      {
        authentication: MOCK_AUTH,
        message: email.body,
        subject: email.subject,
        notificationChannelType: "email",
        users: users.map((u) => u.username),
      },
    ];
    expect(actualArgs).toEqual(expectedArgs);
  });

  it("Sets a batch size of 1 when user is not an admin", async () => {
    notificationSpy.and.callFake(() => Promise.resolve({ success: true }));
    const result = await emailOrgUsers(users, email, MOCK_AUTH, false);
    expect(result).toEqual({ success: true });
    expect(notificationSpy).toHaveBeenCalled();
    const actualArgs = notificationSpy.calls.first().args;
    const expectedArgs = [
      {
        authentication: MOCK_AUTH,
        message: email.body,
        subject: email.subject,
        notificationChannelType: "email",
        users: users.map((u) => u.username),
        batchSize: 1,
      },
    ];
    expect(actualArgs).toEqual(expectedArgs);
  });

  it("Resolves to null when users array is empty", async () => {
    const result = await emailOrgUsers([], email, MOCK_AUTH, false);
    expect(result).toEqual(null);
    expect(notificationSpy).not.toHaveBeenCalled();
  });
});
