import {
  describe,
  it,
  expect,
  beforeEach,
} from "vitest";
import { checkPlatformVersion } from "../../../src/permissions/_internal/checkPlatformVersion";
import { IArcGISContext } from "../../../src/types/IArcGISContext";
import { IPermissionPolicy } from "../../../src/permissions/types/IPermissionPolicy";

describe("checkPlatformVersion", () => {
  let context: IArcGISContext;
  let policy: IPermissionPolicy;

  beforeEach(() => {
    context = {
      portal: {
        currentVersion: "2024.1",
      },
    } as unknown as IArcGISContext;
    policy = {
      permission: "hub:project",
    } as IPermissionPolicy;
  });

  it("returns empty array if policy.platformVersion is not specified", () => {
    const result = checkPlatformVersion(policy, context);
    expect(result).toEqual([]);
  });

  it("denies access if currentVersion < platformVersion", () => {
    policy.platformVersion = 2024.2;
    context.portal.currentVersion = "2024.1";
    const result = checkPlatformVersion(policy, context);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({
      response: "platform-version-not-met",
      value: "2024.1",
      code: "PC141",
      name: "Platform Version Check",
    });
  });

  it("grants access if currentVersion == platformVersion", () => {
    policy.platformVersion = 2024.1;
    context.portal.currentVersion = "2024.1";
    const result = checkPlatformVersion(policy, context);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({
      response: "granted",
      value: "2024.1",
      code: "PC100",
      name: "Platform Version Check",
    });
  });

  it("grants access if currentVersion > platformVersion", () => {
    policy.platformVersion = 2024.0;
    context.portal.currentVersion = "2024.1";
    const result = checkPlatformVersion(policy, context);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({
      response: "granted",
      value: "2024.1",
      code: "PC100",
      name: "Platform Version Check",
    });
  });

  it("handles currentVersion as string with extra zeros", () => {
    policy.platformVersion = 2024.1;
    context.portal.currentVersion = "2024.10";
    const result = checkPlatformVersion(policy, context);
    expect(result[0].response).toBe("granted");
  });

  it("handles currentVersion as string with whitespace", () => {
    policy.platformVersion = 2024.1;
    context.portal.currentVersion = " 2024.0 ";
    const result = checkPlatformVersion(policy, context);
    expect(result[0].response).toBe("platform-version-not-met");
  });

  it("handles currentVersion as non-numeric string", () => {
    policy.platformVersion = 2024.1;
    context.portal.currentVersion = "not-a-version";
    const result = checkPlatformVersion(policy, context);
    // parseFloat("not-a-version") returns NaN, NaN < 2024.1 is false
    expect(result[0].response).toBe("granted");
  });
});
