import { IFilterGroup, IHubSearchOptions } from "../../../src";
import { portalSearchUsers } from "../../../src/search/_internal/portalSearchUsers";

describe("portalSearchUsers:", () => {
  it("throws if requestOptions not passed in IHubSearchOptions", async () => {
    const f: IFilterGroup<"user"> = {
      operation: "AND",
      filterType: "user",
      filters: [
        {
          filterType: "user",
          term: "water",
        },
      ],
    };
    const opts: IHubSearchOptions = {};

    try {
      await portalSearchUsers([f], opts);
    } catch (err) {
      expect(err.name).toBe("HubError");
      expect(err.message).toBe(
        "requestOptions: IHubRequestOptions is required."
      );
    }
  });
});
