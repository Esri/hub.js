import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from "vitest";
import * as authenticateRequestModule from "../../../src/newsletters/api/utils/authenticate-request";
import * as orvalModule from "../../../src/newsletters/api/orval/api/orval-newsletters";
import {
  DeliveryMethod,
  ISubscription,
  SystemNotificationSpecNames,
} from "../../../src/newsletters/api/orval/api/orval-newsletters";
import {
  ICreateSubscriptionParams,
  IGetSubscriptionParams,
  IGetSubscriptionsParams,
  ISubscribeParams,
  IUpdateSubscriptionParams,
  NewsletterCadence,
} from "../../../src/newsletters/api/types";
import {
  createSubscription,
  getSubscription,
  getSubscriptions,
  subscribe,
  updateSubscription,
} from "../../../src/newsletters/api/subscriptions";

describe("Subscriptions", () => {
  const token = "aaa";
  let authenticateRequestSpy: any;

  beforeEach(() => {
    authenticateRequestSpy = vi
      .spyOn(authenticateRequestModule, "authenticateRequest")
      .mockImplementation(async () => token);
  });

  describe("subscribe", () => {
    it("should subscribe", async () => {
      const mockSubscription = {
        subscription: "mock",
      } as unknown as ISubscription;
      const subscribeSpy = vi
        .spyOn(orvalModule, "subscribe")
        .mockImplementation(async () => mockSubscription);

      const options: ISubscribeParams = {
        data: {
          cadence: NewsletterCadence.WEEKLY,
          deliveryMethod: DeliveryMethod.EMAIL,
          notificationSpecName: SystemNotificationSpecNames.TELEMETRY_REPORT,
          metadata: {
            type: SystemNotificationSpecNames.TELEMETRY_REPORT,
            hostname: "mock.com",
          },
        },
      };

      const result = await subscribe(options);
      expect(result).toEqual(mockSubscription);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(subscribeSpy).toHaveBeenCalledWith(options.data, {
        ...options,
        token,
      });
    });
  });

  describe("createSubscription", () => {
    it("should create a subscription", async () => {
      const mockSubscription = {
        subscription: "mock",
      } as unknown as ISubscription;
      const createSubscriptionSpy = vi
        .spyOn(orvalModule, "createSubscription")
        .mockImplementation(async () => mockSubscription);

      const options: ICreateSubscriptionParams = {
        data: {
          cadence: NewsletterCadence.WEEKLY,
          deliveryMethod: DeliveryMethod.EMAIL,
          notificationSpecName: SystemNotificationSpecNames.TELEMETRY_REPORT,
          metadata: {
            type: SystemNotificationSpecNames.TELEMETRY_REPORT,
            hostname: "mock.com",
          },
          userId: "111",
        },
      };

      const result = await createSubscription(options);
      expect(result).toEqual(mockSubscription);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(createSubscriptionSpy).toHaveBeenCalledWith(options.data, {
        ...options,
        token,
      });
    });
  });

  describe("getSubscription", () => {
    it("should get a subscription", async () => {
      const mockSubscription = {
        subscription: "mock",
      } as unknown as ISubscription;
      const getSubscriptionSpy = vi
        .spyOn(orvalModule, "getSubscription")
        .mockImplementation(async () => mockSubscription);

      const options: IGetSubscriptionParams = {
        subscriptionId: 111,
      };

      const result = await getSubscription(options);
      expect(result).toEqual(mockSubscription);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(getSubscriptionSpy).toHaveBeenCalledWith(options.subscriptionId, {
        ...options,
        token,
      });
    });
  });

  describe("getSubscriptions", () => {
    it("should get subscriptions", async () => {
      const mockSubscription = {
        subscription: "mock",
      } as unknown as ISubscription;
      const getSubscriptionsSpy = vi
        .spyOn(orvalModule, "getSubscriptions")
        .mockImplementation(async () => [mockSubscription]);

      const options: IGetSubscriptionsParams = {
        data: {
          userId: "111",
          cadence: NewsletterCadence.WEEKLY,
          active: true,
          entityId: "67e9ba62-8fa3-11ee-b9d1-0242ac120002",
        },
      };

      const result = await getSubscriptions(options);
      expect(result).toEqual([mockSubscription]);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(getSubscriptionsSpy).toHaveBeenCalledWith(options.data, {
        ...options,
        token,
      });
    });
  });

  describe("updateSubscription", () => {
    it("should update a subscription", async () => {
      const mockSubscription = {
        subscription: "mock",
      } as unknown as ISubscription;
      const updateSubscriptionSpy = vi
        .spyOn(orvalModule, "updateSubscription")
        .mockImplementation(async () => mockSubscription);

      const options: IUpdateSubscriptionParams = {
        subscriptionId: 111,
        data: { cadence: NewsletterCadence.MONTHLY },
      };

      const result = await updateSubscription(options);
      expect(result).toEqual(mockSubscription);

      expect(authenticateRequestSpy).toHaveBeenCalledWith(options);
      expect(updateSubscriptionSpy).toHaveBeenCalledWith(
        options.subscriptionId,
        options.data,
        { ...options, token }
      );
    });
  });
});
