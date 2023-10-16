import { HubEntity, IArcGISContext } from "../../../src";
import { IPermissionPolicy } from "../../../src/permissions/types";
import { checkOwner } from "../../../src/permissions/_internal/checkOwner";

describe("checkOwner:", () => {
  it("returns entity-required if not passed entity", () => {
    const ctx = {
      isAuthenticated: true,
      currentUser: {
        username: "test-user",
      },
    } as unknown as IArcGISContext;
    const policy = {
      entityOwner: true,
    } as unknown as IPermissionPolicy;

    const chks = checkOwner(policy, ctx);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("entity-required");
  });
  it("returns granted if entity.owner = username is true", () => {
    const ctx = {
      isAuthenticated: true,
      currentUser: {
        username: "test",
      },
    } as unknown as IArcGISContext;
    const policy = {
      entityOwner: true,
    } as unknown as IPermissionPolicy;
    const entity = {
      owner: "test",
    } as unknown as HubEntity;
    const chks = checkOwner(policy, ctx, entity);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("granted");
  });
  it("returns not-owner if user is not owner", () => {
    const ctx = {
      isAuthenticated: true,
      currentUser: {
        username: "test",
      },
    } as unknown as IArcGISContext;
    const policy = {
      entityOwner: true,
    } as unknown as IPermissionPolicy;
    const entity = {
      owner: "not-test",
    } as unknown as HubEntity;
    const chks = checkOwner(policy, ctx, entity);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("not-owner");
  });
  it("returns not-authenticated if not authenticated", () => {
    const ctx = {
      isAuthenticated: false,
    } as unknown as IArcGISContext;
    const policy = {
      entityOwner: true,
    } as unknown as IPermissionPolicy;
    const entity = {
      owner: "not-test",
    } as unknown as HubEntity;
    const chks = checkOwner(policy, ctx, entity);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("not-authenticated");
  });
  it("returns empty array if policy does not specify entityOwner", () => {
    const ctx = {} as unknown as IArcGISContext;
    const policy = {} as unknown as IPermissionPolicy;
    const entity = {} as unknown as HubEntity;
    const chks = checkOwner(policy, ctx, entity);
    expect(chks.length).toBe(0);
  });
  it("returns empty array if policy entityOwner is false", () => {
    const ctx = {} as unknown as IArcGISContext;
    const policy = {
      entityOwner: false,
    } as unknown as IPermissionPolicy;
    const entity = {} as unknown as HubEntity;
    const chks = checkOwner(policy, ctx, entity);
    expect(chks.length).toBe(0);
  });
});
