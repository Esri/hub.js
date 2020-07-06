import { _ensurePortalDomainKeyword } from "../src";

describe("_ensurePortalDomainKeyword", () => {
  it("adds domain keyword if not present", () => {
    const kwds = ["hubsubdomain|foobarbaz", "some-other-keyword"];

    expect(_ensurePortalDomainKeyword("newDomain", kwds)).toEqual(
      ["hubsubdomain|newdomain", "some-other-keyword"],
      "removes old domain keyword and adds new"
    );
  });

  it("leaves typeKeywords alone if already present", () => {
    const kwds = ["hubsubdomain|foobarbaz", "some-other-keyword"];

    expect(_ensurePortalDomainKeyword("foobarbaz", kwds)).toEqual(
      ["hubsubdomain|foobarbaz", "some-other-keyword"],
      "leaves it alone"
    );
  });

  it("defaults typekeywords to an empty array", () => {
    expect(_ensurePortalDomainKeyword("foobarbaz")).toEqual(
      ["hubsubdomain|foobarbaz"],
      "leaves it alone"
    );
  });
});
