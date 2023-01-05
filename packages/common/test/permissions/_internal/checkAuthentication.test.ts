import { IArcGISContext, IPermissionPolicy } from "../../../src";
import { checkAuthentication } from "../../../src/permissions/_internal/checkAuthentication";

describe("checkAuthentication:", () => {
  it("returns granted if policy requires auth", () => {
    const ctx = {
      isAuthenticated: true,
    } as unknown as IArcGISContext;
    const policy = {
      authenticated: true,
    } as unknown as IPermissionPolicy;

    const chks = checkAuthentication(policy, ctx);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("granted");
  });
  it("returns granted if policy does not require auth", () => {
    const ctx = {
      isAuthenticated: true,
    } as unknown as IArcGISContext;
    const policy = {
      authenticated: false,
    } as unknown as IPermissionPolicy;

    const chks = checkAuthentication(policy, ctx);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("granted");
  });
  it("returns no checks if policy does not define auth", () => {
    const ctx = {
      isAuthenticated: true,
    } as unknown as IArcGISContext;
    const policy = {} as unknown as IPermissionPolicy;

    const chks = checkAuthentication(policy, ctx);
    expect(chks.length).toBe(0);
  });
  it("returns not-authenticated if policy requires auth and user not authd", () => {
    const ctx = {
      isAuthenticated: false,
    } as unknown as IArcGISContext;
    const policy = {
      authenticated: true,
    } as unknown as IPermissionPolicy;

    const chks = checkAuthentication(policy, ctx);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("not-authenticated");
  });
});
