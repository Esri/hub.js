import { describe, it, expect, vi } from "vitest";
import * as AssertionModule from "../../../src/permissions/_internal/checkAssertion";
import { checkAssertions } from "../../../src/permissions/_internal/checkAssertions";
import { IPermissionPolicy } from "../../../src/permissions/types/IPermissionPolicy";
import { IPolicyCheck } from "../../../src/permissions/types/IPolicyCheck";
import { IArcGISContext } from "../../../src/types/IArcGISContext";

describe("checkAssertions:", () => {
  it("returns empty checks if no assertions present", () => {
    const policy: IPermissionPolicy = {
      permission: "hub:project:create",
      services: ["portal"],
    };
    const ctx = {
      isAuthenticated: true,
    } as unknown as IArcGISContext;
    const entity = {};
    const checks = checkAssertions(policy, ctx, entity);
    expect(checks.length).toBe(0);
  });

  it("maps over assertions", () => {
    const policy: IPermissionPolicy = {
      permission: "hub:project:create",
      services: ["portal"],
      assertions: [
        {
          property: "context:currentUser",
          type: "is-group-owner",
          value: "entity.group.id",
        },
        {
          property: "context:currentUser.username",
          type: "eq",
          value: "entity.owner",
        },
      ],
    };
    const ctx = {
      isAuthenticated: true,
    } as unknown as IArcGISContext;
    const entity = {
      group: {
        id: "123",
      },
    };

    const spy = vi
      .spyOn(AssertionModule as any, "checkAssertion")
      .mockImplementation(() => ({ response: "granted" } as IPolicyCheck));

    const checks = checkAssertions(policy, ctx, entity);
    expect(checks.length).toBe(2);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("checks conditions", () => {
    const policy: IPermissionPolicy = {
      permission: "hub:group:shareContent",
      assertions: [
        {
          conditions: [
            {
              property: "entity:isViewOnly",
              type: "eq",
              value: false,
            },
          ],
          property: "context:currentUser",
          type: "is-group-member",
          value: "entity:id",
        },
        {
          conditions: [
            {
              property: "entity:isViewOnly",
              type: "eq",
              value: true,
            },
          ],
          property: "context:currentUser",
          type: "is-group-admin",
          value: "entity:id",
        },
      ],
    };

    const ctx = {
      isAuthenticated: true,
    } as unknown as IArcGISContext;
    const entity = {
      group: {
        id: "123",
      },
    };

    const spy = vi
      .spyOn(AssertionModule as any, "checkAssertion")
      .mockReturnValueOnce({ response: "granted" } as IPolicyCheck)
      .mockReturnValueOnce({ response: "granted" } as IPolicyCheck)
      .mockReturnValueOnce({ response: "assertion-failed" } as IPolicyCheck);

    const checks = checkAssertions(policy, ctx, entity);
    expect(checks.length).toBe(1);
    expect(spy).toHaveBeenCalledTimes(3);
  });
});
