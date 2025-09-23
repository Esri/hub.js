import { failSafe } from "../../src/utils/fail-safe";

describe("failSafe", function () {
  it("doesnt fail", async function () {
    const rejects = () => {
      return Promise.reject(Error("rejected"));
    };
    const failSafed = failSafe(rejects, "my result");

    let res;
    try {
      res = await failSafed();
    } catch {
      fail(Error("failsafed function rejected"));
    }

    expect(res).toBe("my result", "resolved to mocked result");
  });

  it("resolves with empty object by default", async function () {
    const rejects = () => {
      return Promise.reject(Error("rejected"));
    };
    const failSafed = failSafe(rejects);

    let res;
    try {
      res = await failSafed();
    } catch {
      fail(Error("failsafed function rejected"));
    }

    expect(res).toEqual({}, "resolved to mocked result");
  });
});
