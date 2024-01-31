import {
  IConfirmRegistrationResponse,
  ICreateRegistrationParams,
  ICreateRegistrationResponse,
  IDeleteRegistrationParams,
  IDeleteRegistrationResponse,
  IGetRegistrationParams,
  IGetRegistrationResponse,
  IGetRegistrationsResponse,
  IUpdateRegistrationParams,
  IUpdateRegistrationResponse,
} from "./types";
import { authenticateRequest } from "./utils/authenticate-request";
import {
  createRegistration as _createRegistration,
  getRegistrations as _getRegistrations,
  getRegistration as _getRegistration,
  updateRegistration as _updateRegistration,
  deleteRegistration as _deleteRegistration,
  confirmRegistration as _confirmRegistration,
} from "./orval/api/orval";

/**
 * create an event registration
 *
 * @hidden
 * @param {ICreateEventParams} options
 * @return {*}  {Promise<ICreateRegistrationResponse>}
 */
export async function createRegistration(
  options: ICreateRegistrationParams
): Promise<ICreateRegistrationResponse> {
  options.token = await authenticateRequest(options);
  return _createRegistration(options.data, options);
}

// /**
//  * get registrations
//  *
//  * @hidden
//  * @param {IGetRegistrationsParams} options
//  * @return {*}  {Promise<IGetRegistrationsResponse>}
//  */
// export async function getRegistrations(
//   options: IGetRegistrationsParams
// ): Promise<IGetRegistrationsResponse> {
//   options.token = await authenticateRequest(options);
//   return _getRegistrations(options.data, options);
// }

/**
 * get a registration
 *
 * @hidden
 * @param {IGetRegistrationParams} options
 * @return {*}  {Promise<IGetRegistrationResponse>}
 */
export async function getRegistration(
  options: IGetRegistrationParams
): Promise<IGetRegistrationResponse> {
  options.token = await authenticateRequest(options);
  return _getRegistration(options.registrationId, options);
}

/**
 * update a registration
 *
 * @hidden
 * @param {IUpdateRegistrationParams} options
 * @return {*}  {Promise<IUpdateRegistrationResponse>}
 */
export async function updateRegistration(
  options: IUpdateRegistrationParams
): Promise<IUpdateRegistrationResponse> {
  options.token = await authenticateRequest(options);
  return _updateRegistration(options.registrationId, options.data, options);
}

/**
 * delete a registration
 *
 * @hidden
 * @param {IDeleteRegistrationParams} options
 * @return {*}  {Promise<IDeleteRegistrationResponse>}
 */
export async function deleteRegistration(
  options: IDeleteRegistrationParams
): Promise<IDeleteRegistrationResponse> {
  options.token = await authenticateRequest(options);
  return _deleteRegistration(options.registrationId, options);
}

// /**
//  * confirm a registration
//  *
//  * @hidden
//  * @param {IConfirmRegistrationParams} options
//  * @return {*}  {Promise<IConfirmRegistrationResponse>}
//  */
// export async function confirmRegistration(
//   options: IConfirmRegistrationParams
// ): Promise<IConfirmRegistrationResponse> {
//   options.token = await authenticateRequest(options);
//   return _confirmRegistration(options);
// }
