import { HubEntity, IArcGISContext } from "../../../src";
import { IPermissionPolicy } from "../../../src/permissions/types";
import { checkEdit } from "../../../src/permissions/_internal/checkEdit";

describe("checkEdit:", () => {
  it("returns entity-required if not passed entity", () => {
    const ctx = {} as unknown as IArcGISContext;
    const policy = {
      entityEdit: true,
    } as unknown as IPermissionPolicy;

    const chks = checkEdit(policy, ctx);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("entity-required");
  });
  it("returns granted if entity.canEdit is true", () => {
    const ctx = {} as unknown as IArcGISContext;
    const policy = {
      entityEdit: true,
    } as unknown as IPermissionPolicy;
    const entity = {
      canEdit: true,
    } as unknown as HubEntity;
    const chks = checkEdit(policy, ctx, entity);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("granted");
  });
  it("returns no-edit-access if entity.canEdit is false", () => {
    const ctx = {} as unknown as IArcGISContext;
    const policy = {
      entityEdit: true,
    } as unknown as IPermissionPolicy;
    const entity = {
      canEdit: false,
    } as unknown as HubEntity;
    const chks = checkEdit(policy, ctx, entity);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("no-edit-access");
  });
  it("returns empty array if policy does not specify entityEdit", () => {
    const ctx = {} as unknown as IArcGISContext;
    const policy = {} as unknown as IPermissionPolicy;
    const entity = {
      canEdit: true,
    } as unknown as HubEntity;
    const chks = checkEdit(policy, ctx, entity);
    expect(chks.length).toBe(0);
  });
  it("returns empty array if policy entityEdit is false", () => {
    const ctx = {} as unknown as IArcGISContext;
    const policy = {
      entityEdit: false,
    } as unknown as IPermissionPolicy;
    const entity = {
      canEdit: true,
    } as unknown as HubEntity;
    const chks = checkEdit(policy, ctx, entity);
    expect(chks.length).toBe(0);
  });
});
