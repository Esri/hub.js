import { poll } from "../../src/utils/poll";

describe("poll", () => {
  it("polls the request function until the validation function succeeds", async () => {
    const validationFn = (resp: any) => resp && resp.id;
    const requestFnSpy = jasmine
      .createSpy()
      .and.returnValues(Promise.resolve({}), Promise.resolve({ id: "00c" }));

    const chk = await poll(
      requestFnSpy,
      validationFn,
      // set delay to 0 for testing purposes
      { timeBetweenRequests: 0 }
    );
    expect(requestFnSpy).toHaveBeenCalledTimes(2);
    expect(chk.id).toBe("00c");
  });
  it("throws an error when the timeout is reached", async () => {
    const validationFn = (resp: any) => resp && resp.id;
    const requestFnSpy = jasmine
      .createSpy()
      .and.returnValue(Promise.resolve({}));

    try {
      await poll(requestFnSpy, validationFn, {
        timeBetweenRequests: 100,
        timeout: 300,
      });
    } catch (error) {
      expect(requestFnSpy).toHaveBeenCalledTimes(2);
      expect((error as Error).message).toBe("Polling timeout");
    }
  });
});
