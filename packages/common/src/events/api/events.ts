import {
  IEvent,
  ICreateEventParams,
  IGetEventParams,
  IUpdateEventParams,
  IDeleteEventParams,
} from "./types";
import { authenticateRequest } from "./utils/authenticate-request";
import {
  createEvent as _createEvent,
  getEvents as _getEvents,
  getEvent as _getEvent,
  updateEvent as _updateEvent,
  deleteEvent as _deleteEvent,
} from "./orval/api/orval-events";

/**
 * create an event
 *
 * @param {ICreateEventParams} options
 * @return {*}
 */
export async function createEvent(
  options: ICreateEventParams
): Promise<IEvent> {
  options.token = await authenticateRequest(options);
  return _createEvent(options.data, options);
}

// /**
//  * get events
//  *
//  * @param {IGetEventsParams} options
//  * @return {*}  {Promise<IEvent[]>} // paged response
//  */
// export async function getEvents(
//   options: IGetEventsParams
// ): Promise<IGetEventsResponse> {
//   options.token = await authenticateRequest(options);
//   return _getEvents(options.data);
// }

/**
 * get an event
 *
 * @param {ICreateEventParams} options
 * @return {*}  {Promise<IGetEventEventResponse>}
 */
export async function getEvent(options: IGetEventParams): Promise<IEvent> {
  options.token = await authenticateRequest(options);
  return _getEvent(options.eventId, options);
}

// /**
//  * update an event
//  *
//  * @param {IUpdateEventParams} options
//  *   todo: update return type when defined
//  * @return {*}  {Promise<IEvent>}
//  */
// export async function updateEvent(
//   options: IUpdateEventParams
//   // todo: update return type when defined
// ): Promise<void> {
//   options.token = await authenticateRequest(options);
//   return _updateEvent(options.eventId, options.data, options);
// }

/**
 * delete an event
 *
 * @param {IDeleteEventParams} options
 * @return {*}  {Promise<IEvent>}
 */
export async function deleteEvent(
  options: IDeleteEventParams
): Promise<IEvent> {
  options.token = await authenticateRequest(options);
  return _deleteEvent(options.eventId, options);
}
