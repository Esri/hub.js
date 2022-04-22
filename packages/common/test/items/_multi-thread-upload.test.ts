import { _multiThreadUpload } from "../../src/items/_internal/_multi-thread-upload";

describe("_multiThreadUpload", () => {
  it("Properly works multithreading", async () => {
    const fakeXhrSpy = jasmine
      .createSpy()
      .and.callFake(() => Promise.resolve("Success"));
    const queue = [fakeXhrSpy, fakeXhrSpy, fakeXhrSpy];
    await _multiThreadUpload(queue, 5);
    expect(fakeXhrSpy.calls.count()).toBe(3);
  });
  it("Properly rejects", async () => {
    try {
      const fakeXhrSpy = jasmine
        .createSpy()
        .and.callFake(() => Promise.reject(Error("xhr failed")));
      const queue = [fakeXhrSpy, fakeXhrSpy, fakeXhrSpy];
      await _multiThreadUpload(queue, 5);
      expect(fakeXhrSpy.calls.count()).toBe(3);
    } catch (err) {
      expect(err.message).toEqual("xhr failed");
    }
  });
});
