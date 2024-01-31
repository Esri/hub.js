import {
  ICreateEventResponse,
  ICreateEventParams,
  IGetEventResponse,
  IGetEventParams,
  IGetEventsResponse,
  IUpdateEventParams,
  IUpdateEventResponse,
  IDeleteEventResponse,
  IDeleteEventParams,
} from "./types";
import { authenticateRequest } from "./utils/authenticate-request";
import {
  createEvent as _createEvent,
  getEvents as _getEvents,
  getEvent as _getEvent,
  updateEvent as _updateEvent,
  deleteEvent as _deleteEvent,
} from "./orval/api/orval";

/**
 * create an event
 *
 * @hidden
 * @param {ICreateEventParams} options
 * @return {*}  {Promise<ICreateEventResponse>}
 */
export async function createEvent(
  options: ICreateEventParams
): Promise<ICreateEventResponse> {
  options.token = await authenticateRequest(options);
  return _createEvent(options.data, options);
}

// /**
//  * get events
//  *
//  * @hidden
//  * @param {IGetEventsParams} options
//  * @return {*}  {Promise<IGetEventsResponse>}
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
 * @hidden
 * @param {ICreateEventParams} options
 * @return {*}  {Promise<IGetEventEventResponse>}
 */
export async function getEvent(
  options: IGetEventParams
): Promise<IGetEventResponse> {
  options.token = await authenticateRequest(options);
  return _getEvent(options.eventId, options);
}

/**
 * update an event
 *
 * @hidden
 * @param {ICreateEventParams} options
 *   todo: update return type when defined
 * @return {*}  {Promise<>}
 */
export async function updateEvent(
  options: IUpdateEventParams
  // todo: update return type when defined
): Promise<void> {
  options.token = await authenticateRequest(options);
  return _updateEvent(options.eventId, options.data, options);
}

/**
 * delete an event
 *
 * @hidden
 * @param {IDeleteEventParams} options
 * @return {*}  {Promise<IDeleteEventParams>}
 */
export async function deleteEvent(
  options: IDeleteEventParams
): Promise<IDeleteEventResponse> {
  options.token = await authenticateRequest(options);
  return _deleteEvent(options.eventId, options);
}
