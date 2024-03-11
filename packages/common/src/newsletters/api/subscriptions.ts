import {
  ISubscribeParams,
  ISubscription,
  ICreateSubscriptionParams,
  IGetSubscriptionsParams,
  IGetSubscriptionParams,
  IUpdateSubscriptionParams,
} from "./types";
import { authenticateRequest } from "./utils/authenticate-request";
import {
  subscribe as _subscribe,
  createSubscription as _createSubscription,
  getSubscriptions as _getSubscriptions,
  getSubscription as _getSubscription,
  updateSubscription as _updateSubscription,
} from "./orval/api/orval-newsletters";

/**
 * create a subscription for user (existing or not) to a newsletter
 *
 * @param {ISubscribeParams} options
 * @return {Promise<ISubscription>}
 */
export async function subscribe(
  options: ISubscribeParams
): Promise<ISubscription> {
  options.token = await authenticateRequest(options);
  return _subscribe(options.data, options);
}

/**
 * create a subscription for user (existing) to a newsletter
 *
 * @param {ICreateSubscriptionParams} options
 * @return {Promise<ISubscription>}
 */
export async function createSubscription(
  options: ICreateSubscriptionParams
): Promise<ISubscription> {
  options.token = await authenticateRequest(options);
  return _createSubscription(options.data, options);
}

/**
 * get subscriptions
 *
 * @param {IGetSubscriptionsParams} options
 * @return {Promise<ISubscription[]>}
 */
export async function getSubscriptions(
  options: IGetSubscriptionsParams
): Promise<ISubscription[]> {
  options.token = await authenticateRequest(options);
  return _getSubscriptions(options.data, options);
}

/**
 * get a subscription
 *
 * @param {IGetSubscriptionParams} options
 * @return {Promise<ISubscription>}
 */
export async function getSubscription(
  options: IGetSubscriptionParams
): Promise<ISubscription> {
  options.token = await authenticateRequest(options);
  return _getSubscription(options.subscriptionId, options);
}

/**
 * update a subscription
 *
 * @param {IUpdateSubscriptionParams} options
 * @return {Promise<ISubscription>}
 */
export async function updateSubscription(
  options: IUpdateSubscriptionParams
): Promise<ISubscription> {
  options.token = await authenticateRequest(options);
  return _updateSubscription(options.subscriptionId, options.data, options);
}
