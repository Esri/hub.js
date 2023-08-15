import { IPermissionPolicy } from "../../../src";
import { IArcGISContext } from "../../../src/ArcGISContext";
import { checkParents } from "../../../src/permissions/_internal/checkParents";
import * as CheckPermissionModule from "../../../src/permissions/checkPermission";

describe("checkParents:", () => {
  it("no check if parents not in policy", () => {
    const ctx = {
      isAlphaOrg: true,
    } as unknown as IArcGISContext;
    const policy = {
      licenses: ["hub-premium"],
    } as unknown as IPermissionPolicy;

    const chks = checkParents(policy, ctx);
    expect(chks.length).toBe(0);
  });
  it("no check if parents is empty", () => {
    const ctx = {
      isAlphaOrg: true,
    } as unknown as IArcGISContext;
    const policy = {
      licenses: ["hub-premium"],
      dependencies: [],
    } as unknown as IPermissionPolicy;

    const chks = checkParents(policy, ctx);
    expect(chks.length).toBe(0);
  });
  it("delegates to checkPermission for parent entries", () => {
    const ctx = {
      isAlphaOrg: true,
    } as unknown as IArcGISContext;
    const policy = {
      dependencies: ["hub:project"],
    } as unknown as IPermissionPolicy;

    const spy = spyOn(CheckPermissionModule, "checkPermission").and.returnValue(
      { checks: [{}] }
    );

    const chks = checkParents(policy, ctx);
    expect(spy).toHaveBeenCalled();
    expect(chks.length).toBe(1);
  });
});
