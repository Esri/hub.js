/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRevertableTaskResult, IRevertableTaskSuccess, IRevertableTaskFailed } from "../types";

/**
 * Runs the given task and returns a IRevertableTaskResult
 * @param {Function} task A task method to run
 * @param {Function} revert A method to revert the task
 * @returns {Promise<IRevertableTaskResult>}
 */
export const runRevertableTask = (
  task: (...args: any[]) => Promise<any>,
  revert: (...args: any[]) => Promise<any>
): Promise<IRevertableTaskResult> => {
  return task()
    .then((results) => {
      return { status: "fullfilled", results, revert } as IRevertableTaskSuccess;
    })
    .catch((error) => {
      return { status: "rejected", error };
    });
};

/**
 * Processes an Array of Promise<IRevertableTaskResult>. When all IRevertableTaskResult
 * are IRevertableTaskSuccess, it resolves an Array of all result values. If any
 * IRevertableTaskResult are IRevertableTaskFailed, it reverts all IRevertableTaskSuccess
 * and rejects with the first IRevertableTaskFailed error
 * @param revertableTasks 
 * @returns {Promise<any[]>}
 */
export const processRevertableTasks = (
  revertableTasks: Promise<IRevertableTaskResult>[]
): Promise<any[]> => {
  return Promise.all(revertableTasks)
    .then((results) => {
      const isFullfilled = (result: IRevertableTaskResult) => result.status === "fullfilled";
      const successfulTasks = results.filter(isFullfilled) as IRevertableTaskSuccess[];
      const failedTasks = results.filter(
        (result: IRevertableTaskResult) => !isFullfilled(result)
      ) as IRevertableTaskFailed[];
      if (failedTasks.length) {
        const reverts = successfulTasks.map(
          task => task.revert()
        );

        // fire & forget
        Promise.all(reverts).catch(() => {});

        throw failedTasks[0].error;
      }

      const returnResults: any[]  = successfulTasks.map(
        (result: IRevertableTaskSuccess) => result.results
      );

      return returnResults;
    })
};
