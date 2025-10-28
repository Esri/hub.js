import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from "vitest";

import * as authenticateRequestModule from "../../../src/newsletters-scheduler/api/utils/authenticate-request";
import * as orvalModule from "../../../src/newsletters-scheduler/api/orval/api/orval-newsletters-scheduler";
import {
  INotifyParams,
  ISchedulerSubscription,
  SchedulerCadence,
  SchedulerSubscriptionAction,
  SchedulerSystemNotificationSpecNames,
  SubscriptionEntityType,
} from "../../../src/newsletters-scheduler/api/types";
import { notify } from "../../../src/newsletters-scheduler/api/subscriptions";

describe("Subscriptions", () => {
  const token = "aaa";
  let authenticateRequestSpy: any;

  beforeEach(() => {
    authenticateRequestSpy = vi
      .spyOn(authenticateRequestModule, "authenticateRequest")
      .mockImplementation(async () => token);
  });

  describe("/subscriptions/notify", () => {
    it("should notify", async () => {
      const mockSubscription = {
        subscription: "mock",
      } as unknown as ISchedulerSubscription[];
      const notifySpy = vi
        .spyOn(orvalModule, "notify")
        .mockImplementation(async () => mockSubscription);

      const options: INotifyParams = {
        data: {
          action: SchedulerSubscriptionAction.DISCUSSION_POST_PENDING,
          cadence: SchedulerCadence.WEEKLY,
          notificationSpecName:
            SchedulerSystemNotificationSpecNames.DISCUSSION_ON_ENTITY,
          entityId: "burrito",
          entityType: SubscriptionEntityType.DISCUSSION,
        },
      };

      const result = await notify(options);
      expect(result).toEqual(mockSubscription);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(notifySpy).toHaveBeenCalledWith(options.data, {
        ...options,
        token,
      });
    });
  });
});
