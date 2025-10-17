import { HubEntity } from "../../../src/core/types/HubEntity";
import { checkDelete } from "../../../src/permissions/_internal/checkDelete";
import { IPermissionPolicy } from "../../../src/permissions/types/IPermissionPolicy";
import { IArcGISContext } from "../../../src/types/IArcGISContext";

describe("checkDelete:", () => {
  it("returns entity-required if not passed entity", () => {
    const ctx = {} as unknown as IArcGISContext;
    const policy = {
      entityDelete: true,
    } as unknown as IPermissionPolicy;

    const chks = checkDelete(policy, ctx);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("entity-required");
  });
  it("returns granted if entity.canDelete is true", () => {
    const ctx = {} as unknown as IArcGISContext;
    const policy = {
      entityDelete: true,
    } as unknown as IPermissionPolicy;
    const entity = {
      canDelete: true,
    } as unknown as HubEntity;
    const chks = checkDelete(policy, ctx, entity);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("granted");
  });
  it("returns no-delete-access if entity.canDelete is false", () => {
    const ctx = {} as unknown as IArcGISContext;
    const policy = {
      entityDelete: true,
    } as unknown as IPermissionPolicy;
    const entity = {
      canDelete: false,
    } as unknown as HubEntity;
    const chks = checkDelete(policy, ctx, entity);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("no-delete-access");
  });
  it("returns empty array if policy does not specify entityDelete", () => {
    const ctx = {} as unknown as IArcGISContext;
    const policy = {} as unknown as IPermissionPolicy;
    const entity = {
      canDelete: true,
    } as unknown as HubEntity;
    const chks = checkDelete(policy, ctx, entity);
    expect(chks.length).toBe(0);
  });
  it("returns edit-access if policy entityDelete is false", () => {
    const ctx = {} as unknown as IArcGISContext;
    const policy = {
      entityDelete: false,
    } as unknown as IPermissionPolicy;
    const entity = {
      canDelete: true,
    } as unknown as HubEntity;
    const chks = checkDelete(policy, ctx, entity);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("delete-access");
  });
});
