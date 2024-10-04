import {
  ISubscription,
  Cadence,
  SystemNotificationSpecNames,
  INotifyParams,
  notify,
  SubscriptionEntityType,
  SubscriptionActions,
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
      } as unknown as ISubscription[];
      const notifySpy = spyOn(orvalModule, "notify").and.callFake(
        async () => mockSubscription
      );

      const options: INotifyParams = {
        data: {
          actions: [SubscriptionActions.DISCUSSION_POST_PENDING],
          cadence: Cadence.WEEKLY,
          notificationSpecName:
            SystemNotificationSpecNames.DISCUSSION_ON_ENTITY,
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
