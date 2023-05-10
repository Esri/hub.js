import { setStatusKeyword } from "../../../src/projects/_internal/setStatusKeyword";
import { PROJECT_STATUSES } from "../../../src";

describe("setStatusKeyword:", () => {
  it("updates existing status keyword", () => {
    const chk = setStatusKeyword(
      ["status|oldStatus"],
      PROJECT_STATUSES.inProgress
    );
    expect(chk.length).toBe(1);
    expect(chk[0]).toBe("status|inProgress");
  });
  it("adds status entry to keywords", () => {
    const chk = setStatusKeyword(["otherKeyword"], PROJECT_STATUSES.notStarted);
    expect(chk.length).toBe(2);
    expect(chk[1]).toBe("status|notStarted");
  });
});
