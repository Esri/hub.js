/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRevertableTaskResult } from "../../src/types";
import {
  runRevertableTask,
  processRevertableTasks
} from "../../src/utils/revertable-tasks";

describe("runnable tasks", function() {
  describe("runRevertableTask", function() {
    it("should return an IRevertableTaskSuccess when task resolves", async function() {
      const taskSpy = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve("my results"));
      const revertSpy = jasmine.createSpy().and.returnValue(Promise.resolve());
      const results = await runRevertableTask(taskSpy, revertSpy);
      expect(taskSpy.calls.count()).toBe(1);
      expect(taskSpy.calls.argsFor(0)).toEqual([]);
      expect(results).toEqual({
        status: "fullfilled",
        results: "my results",
        revert: revertSpy
      });
    });

    it("should return an IRevertableTaskSuccess when task resolves", async function() {
      const error = new Error("fail");
      const taskSpy = jasmine
        .createSpy()
        .and.returnValue(Promise.reject(error));
      const revertSpy = jasmine.createSpy();
      const results = await runRevertableTask(taskSpy, revertSpy);
      expect(taskSpy.calls.count()).toBe(1);
      expect(taskSpy.calls.argsFor(0)).toEqual([]);
      expect(results).toEqual({
        status: "rejected",
        error
      });
    });
  });

  describe("processRevertableTasks", function() {
    it("should resolve an any[] of results when all tasks complete successfully", async function() {
      const revertSpy1 = jasmine.createSpy().and.returnValue(Promise.resolve());
      const revertSpy2 = jasmine.createSpy().and.returnValue(Promise.resolve());
      const revertableTasks: Array<Promise<IRevertableTaskResult>> = [
        Promise.resolve({
          status: "fullfilled",
          results: "one",
          revert: revertSpy1
        }),
        Promise.resolve({
          status: "fullfilled",
          results: "two",
          revert: revertSpy2
        })
      ];
      const results = await processRevertableTasks(revertableTasks);
      expect(results).toEqual(["one", "two"]);
      expect(revertSpy1.calls.count()).toBe(0);
      expect(revertSpy2.calls.count()).toBe(0);
    });

    it("should revert any successful tasks when one or more reject", async function(done) {
      const error = new Error("failed");
      const revertSpy1 = jasmine.createSpy().and.returnValue(Promise.resolve());
      const revertSpy2 = jasmine.createSpy().and.returnValue(Promise.resolve());
      const revertableTasks: Array<Promise<IRevertableTaskResult>> = [
        Promise.resolve({
          status: "fullfilled",
          results: "one",
          revert: revertSpy1
        }),
        Promise.resolve({
          status: "fullfilled",
          results: "two",
          revert: revertSpy2
        }),
        Promise.resolve({ status: "rejected", error })
      ];
      try {
        await processRevertableTasks(revertableTasks);
        done.fail("should have rejected");
      } catch (e) {
        expect(e).toEqual(error);
        expect(revertSpy1.calls.count()).toBe(1);
        expect(revertSpy1.calls.argsFor(0)).toEqual([]);
        expect(revertSpy2.calls.count()).toBe(1);
        expect(revertSpy2.calls.argsFor(0)).toEqual([]);
        done();
      }
    });

    it("should suppress any errors during revert", async function(done) {
      const error = new Error("failed task");
      const error2 = new Error("failed revert");
      const revertSpy1 = jasmine
        .createSpy()
        .and.returnValue(Promise.reject(error2));
      const revertSpy2 = jasmine.createSpy().and.returnValue(Promise.resolve());
      const revertableTasks: Array<Promise<IRevertableTaskResult>> = [
        Promise.resolve({
          status: "fullfilled",
          results: "one",
          revert: revertSpy1
        }),
        Promise.resolve({
          status: "fullfilled",
          results: "two",
          revert: revertSpy2
        }),
        Promise.resolve({ status: "rejected", error })
      ];
      try {
        await processRevertableTasks(revertableTasks);
        done.fail("should have rejected");
      } catch (e) {
        expect(e).toEqual(error);
        expect(revertSpy1.calls.count()).toBe(1);
        expect(revertSpy1.calls.argsFor(0)).toEqual([]);
        expect(revertSpy2.calls.count()).toBe(1);
        expect(revertSpy2.calls.argsFor(0)).toEqual([]);
        done();
      }
    });
  });
});
