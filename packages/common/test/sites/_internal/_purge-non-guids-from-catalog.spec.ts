import {
  describe,
  it,
  expect,
} from "vitest";
import { _purgeNonGuidsFromCatalog } from "../../../src/sites/_internal/_purge-non-guids-from-catalog";

describe("_purgeNonGuidsFromCatalog", () => {
  it("purges non-guid entries", () => {
    const model: any = {
      item: { properties: {} },
      data: { catalog: { groups: ["1", "not-a-guid"] } },
    };
    const chk = _purgeNonGuidsFromCatalog(model);
    expect(chk).toBeDefined();
  });
});
