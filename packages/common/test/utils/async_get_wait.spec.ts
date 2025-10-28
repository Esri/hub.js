import { asyncForEach } from "../../src/utils/asyncForEach";
import { getEventThumbnail } from "../../src/utils/getEventThumbnail";
import { wait } from "../../src/utils/wait";
import { describe, it, expect, vi } from "vitest";

describe("async/get/wait utilities", () => {
  it("asyncForEach calls callbacks in order and awaits", async () => {
    const calls: number[] = [];
    await asyncForEach([1, 2, 3], async (n) => {
      await wait(0);
      calls.push(n);
    });
    expect(calls).toEqual([1, 2, 3]);
  });

  it("getEventThumbnail returns expected URL", () => {
    expect(getEventThumbnail()).toContain("placeholders/event.png");
  });

  it("wait resolves after delay (fake timers)", async () => {
    vi.useFakeTimers();
    const p = wait(1000);
    vi.advanceTimersByTime(1000);
    await p;
    vi.useRealTimers();
    expect(true).toBe(true);
  });
});
