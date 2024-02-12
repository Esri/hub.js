import {
  IRegistration,
  ICreateRegistrationParams,
  IDeleteRegistrationParams,
  IGetRegistrationParams,
  IUpdateRegistrationParams,
} from "./types";
import { authenticateRequest } from "./utils/authenticate-request";
import {
  createRegistration as _createRegistration,
  getRegistrations as _getRegistrations,
  getRegistration as _getRegistration,
  updateRegistration as _updateRegistration,
  deleteRegistration as _deleteRegistration,
  confirmRegistration as _confirmRegistration,
} from "./orval/api/orval-events";

/**
 * create an event registration
 *
 * @param {ICreateEventParams} options
 * @return {*}  {Promise<IRegistration>}
 */
export async function createRegistration(
  options: ICreateRegistrationParams
): Promise<IRegistration> {
  options.token = await authenticateRequest(options);
  return _createRegistration(options.data, options);
}

// /**
//  * get registrations
//  *
//  * @param {IGetRegistrationsParams} options
//  * @return {*}  {Promise<IRegistration[]>} // paged response?
//  */
// export async function getRegistrations(
//   options: IGetRegistrationsParams
// ): Promise<IRegistration[]> {
//   options.token = await authenticateRequest(options);
//   return _getRegistrations(options.data, options);
// }

/**
 * get a registration
 *
 * @param {IGetRegistrationParams} options
 * @return {*}  {Promise<IRegistration>}
 */
export async function getRegistration(
  options: IGetRegistrationParams
): Promise<IRegistration> {
  options.token = await authenticateRequest(options);
  return _getRegistration(options.registrationId, options);
}

/**
 * update a registration
 *
 * @param {IUpdateRegistrationParams} options
 * @return {*}  {Promise<IRegistration>}
 */
export async function updateRegistration(
  options: IUpdateRegistrationParams
): Promise<IRegistration> {
  options.token = await authenticateRequest(options);
  return _updateRegistration(options.registrationId, options.data, options);
}

/**
 * delete a registration
 *
 * @param {IDeleteRegistrationParams} options
 * @return {*}  {Promise<IRegistration>}
 */
export async function deleteRegistration(
  options: IDeleteRegistrationParams
): Promise<IRegistration> {
  options.token = await authenticateRequest(options);
  return _deleteRegistration(options.registrationId, options);
}

// /**
//  * confirm a registration
//  *
//  * @param {IConfirmRegistrationParams} options
//  * @return {*}  {Promise<IRegistration>}
//  */
// export async function confirmRegistration(
//   options: IConfirmRegistrationParams
// ): Promise<IRegistration> {
//   options.token = await authenticateRequest(options);
//   return _confirmRegistration(options);
// }
