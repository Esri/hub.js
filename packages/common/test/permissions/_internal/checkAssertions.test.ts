import {
  IArcGISContext,
  IPermissionPolicy,
  IPolicyAssertion,
  IPolicyCheck,
} from "../../../src";
import * as AssertionModule from "../../../src/permissions/_internal/checkAssertion";
import { checkAssertions } from "../../../src/permissions/_internal/checkAssertions";

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
    const spy = spyOn(AssertionModule, "checkAssertion").and.callFake(() => {
      return {
        response: "granted",
      } as IPolicyCheck;
    });
    const checks = checkAssertions(policy, ctx, entity);
    expect(checks.length).toBe(2);
    expect(spy.calls.count()).toBe(2);
  });
});
