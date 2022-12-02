import { PolicyResponse } from "../../../src";
import { getPolicyResponseCode } from "../../../src/permissions/_internal/getPolicyResponseCode";

describe("getPolicyResponseCode:", () => {
  it("returns PC000 if no entry", () => {
    const chk = getPolicyResponseCode("foo" as PolicyResponse);
    expect(chk).toBe("PC000");
  });
  it("returns code ", () => {
    const chk = getPolicyResponseCode("granted");
    expect(chk).toBe("PC100");
  });
});
