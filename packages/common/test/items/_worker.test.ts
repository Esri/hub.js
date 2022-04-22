import { _worker } from "../../src/items/_internal/_worker";

describe("_worker", () => {
  it("Properly works through a queue", async () => {
    const fakeXhrSpy = jasmine
      .createSpy()
      .and.callFake(() => Promise.resolve("Success"));
    const queue = [fakeXhrSpy, fakeXhrSpy, fakeXhrSpy];
    await _worker(queue);
    expect(fakeXhrSpy.calls.count()).toBe(3);
  });
});
