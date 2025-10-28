import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock the ESM namespace module so we can override its exports safely
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    addGroupUsers: vi.fn(),
  } as any;
});

import * as restPortalModule from "@esri/arcgis-rest-portal";
import { autoAddUsers } from "../../src/groups/autoAddUsers";
import { MOCK_AUTH } from "./add-users-workflow/fixtures";

describe("auto-add-users", function () {
  let addSpy: any;
  const users: restPortalModule.IUser[] = [
    { username: "luke" },
    { username: "leia" },
    { username: "han" },
  ];
  const groupId = "rebel_alliance";

  beforeEach(() => {
    addSpy = restPortalModule.addGroupUsers as any;
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Properly delegates to addGroupUsers", async () => {
    addSpy.mockResolvedValue({ notAdded: [] });
    const result = await autoAddUsers(groupId, users, MOCK_AUTH);
    expect(result).toEqual({ notAdded: [] });
    expect(addSpy).toHaveBeenCalled();
    const actualArgs = addSpy.mock.calls[0];
    const expectedArgs = [
      {
        authentication: MOCK_AUTH,
        id: groupId,
        users: users.map((u) => u.username),
      },
    ];
    expect(actualArgs).toEqual(expectedArgs);
  });

  it("Resolves to null when users array is empty", async () => {
    const result = await autoAddUsers(groupId, [], MOCK_AUTH);
    expect(result).toEqual(null);
    expect(addSpy).not.toHaveBeenCalled();
  });
});
