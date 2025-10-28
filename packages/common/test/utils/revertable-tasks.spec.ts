/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRevertableTaskResult } from "../../src/hub-types";
import {
  runRevertableTask,
  processRevertableTasks,
} from "../../src/utils/revertable-tasks";
import { describe, it, expect, vi } from "vitest";

describe("runnable tasks", function () {
  describe("runRevertableTask", function () {
    it("should return an IRevertableTaskSuccess when task resolves", async function () {
      const taskSpy = vi.fn().mockResolvedValue("my results");
      const revertSpy = vi.fn().mockResolvedValue(undefined);
      const results = await runRevertableTask(taskSpy, revertSpy);
      expect(taskSpy.mock.calls.length).toBe(1);
      expect(taskSpy.mock.calls[0]).toEqual([]);
      expect(results).toEqual({
        status: "fullfilled",
        results: "my results",
        revert: revertSpy,
      });
    });

    it("should return an IRevertableTaskSuccess when task resolves", async function () {
      const error = new Error("fail");
      const taskSpy = vi.fn().mockRejectedValue(error);
      const revertSpy = vi.fn();
      const results = await runRevertableTask(taskSpy, revertSpy);
      expect(taskSpy.mock.calls.length).toBe(1);
      expect(taskSpy.mock.calls[0]).toEqual([]);
      expect(results).toEqual({
        status: "rejected",
        error,
      });
    });
  });

  describe("processRevertableTasks", function () {
    it("should resolve an any[] of results when all tasks complete successfully", async function () {
      const revertSpy1 = vi.fn().mockResolvedValue(undefined);
      const revertSpy2 = vi.fn().mockResolvedValue(undefined);
      const revertableTasks: Array<Promise<IRevertableTaskResult>> = [
        Promise.resolve({
          status: "fullfilled",
          results: "one",
          revert: revertSpy1,
        }),
        Promise.resolve({
          status: "fullfilled",
          results: "two",
          revert: revertSpy2,
        }),
      ];
      const results = await processRevertableTasks(revertableTasks);
      expect(results).toEqual(["one", "two"]);
      expect(revertSpy1.mock.calls.length).toBe(0);
      expect(revertSpy2.mock.calls.length).toBe(0);
    });

    it("should revert any successful tasks when one or more reject", async function () {
      const error = new Error("failed");
      const revertSpy1 = vi.fn().mockResolvedValue(undefined);
      const revertSpy2 = vi.fn().mockResolvedValue(undefined);
      const revertableTasks: Array<Promise<IRevertableTaskResult>> = [
        Promise.resolve({
          status: "fullfilled",
          results: "one",
          revert: revertSpy1,
        }),
        Promise.resolve({
          status: "fullfilled",
          results: "two",
          revert: revertSpy2,
        }),
        Promise.resolve({ status: "rejected", error }),
      ];
      await expect(processRevertableTasks(revertableTasks)).rejects.toEqual(
        error
      );
      expect(revertSpy1.mock.calls.length).toBe(1);
      expect(revertSpy1.mock.calls[0]).toEqual([]);
      expect(revertSpy2.mock.calls.length).toBe(1);
      expect(revertSpy2.mock.calls[0]).toEqual([]);
    });

    it("should suppress any errors during revert", async function () {
      const error = new Error("failed task");
      const error2 = new Error("failed revert");
      const revertSpy1 = vi.fn().mockRejectedValue(error2);
      const revertSpy2 = vi.fn().mockResolvedValue(undefined);
      const revertableTasks: Array<Promise<IRevertableTaskResult>> = [
        Promise.resolve({
          status: "fullfilled",
          results: "one",
          revert: revertSpy1,
        }),
        Promise.resolve({
          status: "fullfilled",
          results: "two",
          revert: revertSpy2,
        }),
        Promise.resolve({ status: "rejected", error }),
      ];
      await expect(processRevertableTasks(revertableTasks)).rejects.toEqual(
        error
      );
      expect(revertSpy1.mock.calls.length).toBe(1);
      expect(revertSpy1.mock.calls[0]).toEqual([]);
      expect(revertSpy2.mock.calls.length).toBe(1);
      expect(revertSpy2.mock.calls[0]).toEqual([]);
    });
  });
});
