import { autoAddUsersAsAdmins } from "../../../src/groups/_internal/autoAddUsersAsAdmins";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { vi, afterEach, describe, it, expect } from "vitest";

// Mock the portal module so exports are mock functions
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...(original as any),
    addGroupUsers: vi.fn(),
  };
});

import * as restPortalModule from "@esri/arcgis-rest-portal";

describe("autoAddUsersAsAdmin", function () {
  let addSpy: any;
  const admins: restPortalModule.IUser[] = [
    { username: "luke" },
    { username: "leia" },
    { username: "han" },
  ];
  const groupId = "rebel_alliance";

  beforeEach(() => {
    addSpy = restPortalModule.addGroupUsers as unknown as ReturnType<
      typeof vi.fn
    >;
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Properly delegates to addGroupUsers", async () => {
    addSpy.mockResolvedValue({ notAdded: [] });
    const result = await autoAddUsersAsAdmins(groupId, admins, MOCK_AUTH);
    expect(result).toEqual({ notAdded: [] });
    expect(addSpy).toHaveBeenCalled();
    const actualArgs = addSpy.mock.calls[0][0];
    const expectedArgs = {
      authentication: MOCK_AUTH,
      id: groupId,
      admins: admins.map((u) => u.username),
    };
    expect(actualArgs).toEqual(expectedArgs);
  });

  it("Resolves to null when users array is empty", async () => {
    const result = await autoAddUsersAsAdmins(groupId, [], MOCK_AUTH);
    expect(result).toEqual(null);
    expect(addSpy).not.toHaveBeenCalled();
  });
});
