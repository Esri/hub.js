import { failSafe } from "../../src";

describe("failSafe", function() {
  it("doesnt fail", async function() {
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
});
