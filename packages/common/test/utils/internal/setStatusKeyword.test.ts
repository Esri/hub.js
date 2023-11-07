import { HubEntityStatus } from "../../../src/types";
import { setStatusKeyword } from "../../../src/utils/internal/setStatusKeyword";

describe("setStatusKeyword:", () => {
  it("updates existing status keyword", () => {
    const chk = setStatusKeyword(
      ["status|oldStatus"],
      HubEntityStatus.inProgress
    );
    expect(chk.length).toBe(1);
    expect(chk[0]).toBe("status|inProgress");
  });
  it("adds status entry to keywords", () => {
    const chk = setStatusKeyword(["otherKeyword"], HubEntityStatus.notStarted);
    expect(chk.length).toBe(2);
    expect(chk[1]).toBe("status|notStarted");
  });
});
