import {
  ICreateSubscriptionParams,
  ISubscription,
  createSubscription,
  NewsletterCadence,
  DeliveryMethod,
  SystemNotificationSpecNames,
  subscribe,
  getSubscriptions,
  ISubscribeParams,
  IGetSubscriptionParams,
  getSubscription,
  IGetSubscriptionsParams,
  IUpdateSubscriptionParams,
  updateSubscription,
} from "../../../src/newsletters/api";
import * as authenticateRequestModule from "../../../src/newsletters/api/utils/authenticate-request";
import * as orvalModule from "../../../src/newsletters/api/orval/api/orval-newsletters";

describe("Subscriptions", () => {
  const token = "aaa";
  let authenticateRequestSpy: any;

  beforeEach(() => {
    authenticateRequestSpy = spyOn(
      authenticateRequestModule,
      "authenticateRequest"
    ).and.callFake(async () => token);
  });

  describe("subscribe", () => {
    it("should subscribe", async () => {
      const mockSubscription = {
        subscription: "mock",
      } as unknown as ISubscription;
      const subscribeSpy = spyOn(orvalModule, "subscribe").and.callFake(
        async () => mockSubscription
      );

      const options: ISubscribeParams = {
        data: {
          cadence: NewsletterCadence.WEEKLY,
          deliveryMethod: DeliveryMethod.EMAIL,
          notificationSpecName: SystemNotificationSpecNames.TELEMETRY_REPORT,
          metadata: {
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
      const createSubscriptionSpy = spyOn(
        orvalModule,
        "createSubscription"
      ).and.callFake(async () => mockSubscription);

      const options: ICreateSubscriptionParams = {
        data: {
          cadence: NewsletterCadence.WEEKLY,
          deliveryMethod: DeliveryMethod.EMAIL,
          notificationSpecName: SystemNotificationSpecNames.TELEMETRY_REPORT,
          metadata: {
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
      const getSubscriptionSpy = spyOn(
        orvalModule,
        "getSubscription"
      ).and.callFake(async () => mockSubscription);

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
      const getSubscriptionsSpy = spyOn(
        orvalModule,
        "getSubscriptions"
      ).and.callFake(async () => [mockSubscription]);

      const options: IGetSubscriptionsParams = {
        data: {
          userId: "111",
          cadence: NewsletterCadence.WEEKLY,
          active: true,
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
      const updateSubscriptionSpy = spyOn(
        orvalModule,
        "updateSubscription"
      ).and.callFake(async () => mockSubscription);

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
