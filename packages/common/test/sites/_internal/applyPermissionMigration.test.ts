import { IEntityPermissionPolicy, IModel } from "../../../src";
import { applyPermissionMigration } from "../../../src/sites/_internal/applyPermissionMigration";

describe("applyPermissionMigration:", () => {
  it("returns clone", () => {
    const siteModel = {
      item: { properties: { schemaVersion: 1.4 } },
      data: { values: {} },
    } as unknown as IModel;
    const result = applyPermissionMigration(siteModel);
    expect(result).not.toBe(siteModel, "The site object should be a clone.");
  });
  it("ensures permissions array exists", () => {
    const siteModel = {
      item: { properties: { schemaVersion: 1.4 } },
      data: { values: {} },
    } as unknown as IModel;
    const result = applyPermissionMigration(siteModel);
    expect(result.data?.permissions).toBeDefined();
    expect(Array.isArray(result.data?.permissions)).toBeTruthy();
  });
  it("created default policies", () => {
    const siteModel = {
      item: {
        owner: "jsmith",
        properties: {
          schemaVersion: 1.5,
          contentGroupId: "00c",
        },
      },
      data: { values: {} },
    } as unknown as IModel;
    const result = applyPermissionMigration(siteModel);
    const groupPolicy = result.data?.permissions?.find(
      (p: any) => p.collaborationType === "group"
    ) as IEntityPermissionPolicy;
    expect(groupPolicy.collaborationId).toEqual("00c");
    expect(groupPolicy.permission).toEqual("hub:project:create");

    const ownerPolicy = result.data?.permissions?.find(
      (p: any) => p.collaborationType === "user"
    ) as IEntityPermissionPolicy;
    expect(ownerPolicy.collaborationId).toBe("jsmith");
  });
  it("respects existing policies", () => {
    const siteModel = {
      item: {
        owner: "jsmith",
        properties: {
          schemaVersion: 1.5,
          contentGroupId: "00c",
        },
      },
      data: {
        permissions: [
          {
            permission: "hub:project:create",
            collaborationType: "group",
            collaborationId: "00f",
          },
          {
            permission: "hub:project:create",
            collaborationType: "group",
            collaborationId: "00c",
          },
        ],
        values: {},
      },
    } as unknown as IModel;
    const result = applyPermissionMigration(siteModel);
    // should have 3 policies
    expect(result.data?.permissions?.length).toBe(3);
  });
});
