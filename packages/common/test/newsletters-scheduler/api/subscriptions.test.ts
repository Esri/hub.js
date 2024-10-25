import {
  ISchedulerSubscription,
  SchedulerCadence,
  SchedulerSystemNotificationSpecNames,
  INotifyParams,
  notify,
  SubscriptionEntityType,
  SchedulerSubscriptionAction,
} from "../../../src/newsletters-scheduler";
import * as authenticateRequestModule from "../../../src/newsletters-scheduler/api/utils/authenticate-request";
import * as orvalModule from "../../../src/newsletters-scheduler/api/orval/api/orval-newsletters-scheduler";

describe("Subscriptions", () => {
  const token = "aaa";
  let authenticateRequestSpy: any;

  beforeEach(() => {
    authenticateRequestSpy = spyOn(
      authenticateRequestModule,
      "authenticateRequest"
    ).and.callFake(async () => token);
  });

  describe("/subscriptions/notify", () => {
    it("should notify", async () => {
      const mockSubscription = {
        subscription: "mock",
      } as unknown as ISchedulerSubscription[];
      const notifySpy = spyOn(orvalModule, "notify").and.callFake(
        async () => mockSubscription
      );

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
