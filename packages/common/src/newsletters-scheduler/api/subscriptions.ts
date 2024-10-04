import { INotifyParams } from "./types";
import { authenticateRequest } from "./utils/authenticate-request";
import {
  notify as _notify,
  ISubscription,
} from "./orval/api/orval-newsletters-scheduler";

/**
 * Notify (schedule) subscriptions to recipients
 *
 * @param {INotifyParams} options
 * @return {Promise<ISubscription[]>}
 */
export async function notify(options: INotifyParams): Promise<ISubscription[]> {
  options.token = await authenticateRequest(options);
  return _notify(options.data, options);
}
