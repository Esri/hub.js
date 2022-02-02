import { Hub } from "../src";

describe("Hub:", () => {
  it("exists", async () => {
    const chk = await Hub.create({});
    expect(chk).toBeDefined();
  });
});
