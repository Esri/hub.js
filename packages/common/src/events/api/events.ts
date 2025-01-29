import {
  IEvent,
  IPagedEventResponse,
  ICreateEventParams,
  IGetEventParams,
  IGetEventsParams,
  IUpdateEventParams,
  IDeleteEventParams,
  ISearchEventsParams,
} from "./types";
import { authenticateRequest } from "./utils/authenticate-request";
import {
  createEvent as _createEvent,
  getEvents as _getEvents,
  searchEvents as _searchEvents,
  getEvent as _getEvent,
  updateEvent as _updateEvent,
  deleteEvent as _deleteEvent,
} from "./orval/api/orval-events";

/**
 * create an event
 *
 * @param {ICreateEventParams} options
 * @return {Promise<IEvent>}
 */
export async function createEvent(
  options: ICreateEventParams
): Promise<IEvent> {
  options.token = await authenticateRequest(options);
  return _createEvent(options.data, options);
}

/**
 * get events
 * @deprecated use searchEvents instead
 *
 * @param {IGetEventsParams} options
 * @return {Promise<IPagedEventResponse>}
 */
export async function getEvents(
  options: IGetEventsParams
): Promise<IPagedEventResponse> {
  options.token = await authenticateRequest(options);
  return _getEvents(options.data, options);
}

/**
 * search events
 *
 * @param {ISearchEventsParams} options
 * @return {Promise<IPagedEventResponse>}
 */
export async function searchEvents(
  options: ISearchEventsParams
): Promise<IPagedEventResponse> {
  options.token = await authenticateRequest(options);
  return _searchEvents(options.data, options);
}

/**
 * get an event
 *
 * @param {IGetEventParams} options
 * @return {Promise<IEvent>}
 */
export async function getEvent(options: IGetEventParams): Promise<IEvent> {
  options.token = await authenticateRequest(options);
  return _getEvent(options.eventId, options);
}

/**
 * update an event
 *
 * @param {IUpdateEventParams} options
 * @return {Promise<IEvent>}
 */
export async function updateEvent(
  options: IUpdateEventParams
): Promise<IEvent> {
  options.token = await authenticateRequest(options);
  return _updateEvent(options.eventId, options.data, options);
}

/**
 * delete an event
 *
 * @param {IDeleteEventParams} options
 * @return {Promise<IEvent>}
 */
export async function deleteEvent(
  options: IDeleteEventParams
): Promise<IEvent> {
  options.token = await authenticateRequest(options);
  return _deleteEvent(options.eventId, options);
}
