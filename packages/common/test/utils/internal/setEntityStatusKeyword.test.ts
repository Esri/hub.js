import { HubEntityStatus } from "../../../src/types";
import { setEntityStatusKeyword } from "../../../src/utils/internal/setEntityStatusKeyword";

describe("setEntityStatusKeyword:", () => {
  it("updates existing status keyword", () => {
    const chk = setEntityStatusKeyword(
      ["status|oldStatus"],
      HubEntityStatus.inProgress
    );
    expect(chk.length).toBe(1);
    expect(chk[0]).toBe("status|inProgress");
  });
  it("adds status entry to keywords", () => {
    const chk = setEntityStatusKeyword(
      ["otherKeyword"],
      HubEntityStatus.notStarted
    );
    expect(chk.length).toBe(2);
    expect(chk[1]).toBe("status|notStarted");
  });
});
