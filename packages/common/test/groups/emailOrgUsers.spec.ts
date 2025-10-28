// make the ESM namespace mockable so we can override createOrgNotification
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    createOrgNotification: vi.fn(),
  };
});

import * as restPortalModule from "@esri/arcgis-rest-portal";
import { emailOrgUsers } from "../../src/groups/emailOrgUsers";
import { MOCK_AUTH } from "./add-users-workflow/fixtures";
import { IEmail } from "../../src/groups/types/types";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("email-org-users", function () {
  let notificationSpy: any;
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
    notificationSpy = restPortalModule.createOrgNotification as any;
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Properly delegates to createOrgNotification", async () => {
    notificationSpy.mockResolvedValue({ success: true });
    const result = await emailOrgUsers(users, email, MOCK_AUTH, true);
    expect(result).toEqual({ success: true });
    expect(notificationSpy).toHaveBeenCalled();
    const actualArgs = notificationSpy.mock.calls[0];
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
    notificationSpy.mockResolvedValue({ success: true });
    const result = await emailOrgUsers(users, email, MOCK_AUTH, false);
    expect(result).toEqual({ success: true });
    expect(notificationSpy).toHaveBeenCalled();
    const actualArgs = notificationSpy.mock.calls[0];
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
