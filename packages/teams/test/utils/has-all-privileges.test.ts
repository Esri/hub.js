import { hasAllPrivileges } from "../../src/utils/has-all-privileges";

describe("hasAllPrivileges", () => {
  it("checks privs correctly", () => {
    const user = {
      privileges: ["a", "b", "c"]
    };

    expect(hasAllPrivileges(user, ["a", "c"])).toBeTruthy(
      "hasAllPrivs should return true if user has all privs"
    );
    expect(hasAllPrivileges(user, ["x", "c"])).toBeFalsy(
      "hasAllPrivs should return false if user does not have all privs"
    );
  });

  it("returns false when passed non-array", () => {
    const user = {
      privileges: ["a", "b", "c"]
    };

    expect(hasAllPrivileges(user, {} as string[])).toBeFalsy();
  });
});
