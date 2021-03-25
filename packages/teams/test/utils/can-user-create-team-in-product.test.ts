/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IGroupTemplate } from "../../src/types";
import { canUserCreateTeamInProduct } from "../../src/utils/can-user-create-team-in-product";

describe("teams:utils:canUserCreateTeamInProduct:", () => {
  const tmpl = {
    config: {
      requiredPrivs: ["baz"],
      availableIn: ["basic"]
    }
  } as IGroupTemplate;

  it("returns false if user lacks privs", () => {
    const user = {
      privileges: ["foo"],
      groups: [] as any[]
    };

    const result = canUserCreateTeamInProduct(user, "basic", tmpl);
    expect(result).toBeFalsy(
      "User without privs should not be able to create group"
    );
  });
  it("returns false if team not availble in product", () => {
    const user = {
      privileges: ["foo"],
      groups: [] as any[]
    };

    const result = canUserCreateTeamInProduct(user, "premium", tmpl);
    expect(result).toBeFalsy("Team not in product should not be creatable");
  });

  it("returns false if user has 507 or more groups", () => {
    const user = {
      privileges: ["baz"],
      groups: new Array(507)
    };

    const result = canUserCreateTeamInProduct(user, "basic", tmpl);
    expect(result).toBeFalsy("User with > 507 groups can't create team");
  });

  it("returns true if user has privs and less than 511 groups", () => {
    const user = {
      privileges: ["baz"],
      groups: [] as any[]
    };

    const result = canUserCreateTeamInProduct(user, "basic", tmpl);
    expect(result).toBeTruthy("user can creat team if they have privs");
  });
});
