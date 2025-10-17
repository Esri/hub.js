/* eslint-disable @typescript-eslint/unbound-method */
import { poll } from "../../src/utils/poll";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";

describe("poll", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  interface IResult {
    id: number;
  }
  interface IResultResponse {
    results: IResult[];
  }

  const validationFn = (response: IResultResponse) =>
    response.results.length === 2;

  it("should only call requestFn once when it's response passes validationFn", async () => {
    const requestFnSpy = vi
      .fn()
      .mockResolvedValue({ results: [{ id: 1 }, { id: 2 }] });
    const promise = poll<IResultResponse>(requestFnSpy, validationFn);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(0);
    const results = await promise;
    expect(results).toEqual({ results: [{ id: 1 }, { id: 2 }] });
    expect(requestFnSpy).toHaveBeenCalledTimes(1);
  });
  it("should call requestFn until it's response passes validationFn", async () => {
    const requestFnSpy = vi
      .fn()
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }, { id: 2 }] });
    const promise = poll<IResultResponse>(requestFnSpy, validationFn);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(0);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(500);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(1000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(2000);
    const results = await promise;
    expect(results).toEqual({ results: [{ id: 1 }, { id: 2 }] });
    expect(requestFnSpy).toHaveBeenCalledTimes(4);
  });
  it("should default to 7 attempts and an initialRetryDelay of 500ms", async () => {
    const requestFnSpy = vi
      .fn()
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] });
    const promise = poll<IResultResponse>(requestFnSpy, validationFn);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(0);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(500);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(1000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(2000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(4000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(8000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(16000);
    try {
      await promise;
      throw new Error("did not reject");
    } catch (e) {
      expect((e as Error).message).toEqual("Polling failed after 7 attempts");
    }
    expect(requestFnSpy).toHaveBeenCalledTimes(7);
  });
  it("should support configuring maxAttempts", async () => {
    const requestFnSpy = vi
      .fn()
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] });
    const promise = poll<IResultResponse>(requestFnSpy, validationFn, {
      maxAttempts: 3,
    });
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(0);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(500);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(1000);
    try {
      await promise;
      throw new Error("did not reject");
    } catch (e) {
      expect((e as Error).message).toEqual("Polling failed after 3 attempts");
    }
    expect(requestFnSpy).toHaveBeenCalledTimes(3);
  });
  it("should gracefully degrade when a negative value is provided for maxAttempts", async () => {
    const requestFnSpy = vi
      .fn()
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] });
    const promise = poll<IResultResponse>(requestFnSpy, validationFn, {
      maxAttempts: -1,
    });
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(0);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(500);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(1000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(2000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(4000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(8000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(16000);
    try {
      await promise;
      fail("did not reject");
    } catch (e) {
      expect((e as Error).message).toEqual("Polling failed after 7 attempts");
    }
    expect(requestFnSpy).toHaveBeenCalledTimes(7);
  });
  it("should gracefully degrade when a non-numeric value is provided for maxAttempts", async () => {
    const requestFnSpy = vi
      .fn()
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] });
    const promise = poll<IResultResponse>(requestFnSpy, validationFn, {
      maxAttempts: {} as unknown as number,
    });
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(0);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(500);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(1000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(2000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(4000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(8000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(16000);
    try {
      await promise;
      fail("did not reject");
    } catch (e) {
      expect((e as Error).message).toEqual("Polling failed after 7 attempts");
    }
    expect(requestFnSpy).toHaveBeenCalledTimes(7);
  });
  it("should support configuring initialRetryDelay", async () => {
    const requestFnSpy = vi
      .fn()
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] });
    const promise = poll<IResultResponse>(requestFnSpy, validationFn, {
      initialRetryDelay: 100,
    });
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(0);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(100);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(200);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(400);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(800);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(1600);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(3200);
    try {
      await promise;
      fail("did not reject");
    } catch (e) {
      expect((e as Error).message).toEqual("Polling failed after 7 attempts");
    }
    expect(requestFnSpy).toHaveBeenCalledTimes(7);
  });
  it("should gracefully degrade when a negative value is provided for initialRetryDelay", async () => {
    const requestFnSpy = vi
      .fn()
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] });
    const promise = poll<IResultResponse>(requestFnSpy, validationFn, {
      initialRetryDelay: -1,
    });
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(0);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(500);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(1000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(2000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(4000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(8000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(16000);
    try {
      await promise;
      fail("did not reject");
    } catch (e) {
      expect((e as Error).message).toEqual("Polling failed after 7 attempts");
    }
    expect(requestFnSpy).toHaveBeenCalledTimes(7);
  });
  it("should gracefully degrade when a non-numeric value is provided for initialRetryDelay", async () => {
    const requestFnSpy = vi
      .fn()
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] })
      .mockResolvedValueOnce({ results: [{ id: 1 }] });
    const promise = poll<IResultResponse>(requestFnSpy, validationFn, {
      initialRetryDelay: {} as unknown as number,
    });
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(0);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(500);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(1000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(2000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(4000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(8000);
    await new Promise(process.nextTick);
    vi.advanceTimersByTime(16000);
    try {
      await promise;
      fail("did not reject");
    } catch (e) {
      expect((e as Error).message).toEqual("Polling failed after 7 attempts");
    }
    expect(requestFnSpy).toHaveBeenCalledTimes(7);
  });
});
