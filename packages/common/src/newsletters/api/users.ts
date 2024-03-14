import {
  ICreateUserParams,
  IDeleteUserParams,
  IGetUserParams,
  IUpdateUserParams,
  IUser,
} from "./types";
import { authenticateRequest } from "./utils/authenticate-request";
import {
  createUser as _createUser,
  getUser as _getUser,
  updateUser as _updateUser,
  deleteUser as _deleteUser,
} from "./orval/api/orval-newsletters";

/**
 * create a user
 *
 * @param {ICreateUserParams} options
 * @return {Promise<IUser>}
 */
export async function createUser(options: ICreateUserParams): Promise<IUser> {
  options.token = await authenticateRequest(options);
  return _createUser(options.data, options);
}

/**
 * get a user
 *
 * @param {IGetUserParams} options
 * @return {Promise<IUser>}
 */
export async function getUser(options: IGetUserParams): Promise<IUser> {
  options.token = await authenticateRequest(options);
  return _getUser(options.userId, options);
}

/**
 * update a user
 *
 * @param {IUpdateUserParams} options
 * @return {Promise<IUser>}
 */
export async function updateUser(options: IUpdateUserParams): Promise<IUser> {
  options.token = await authenticateRequest(options);
  return _updateUser(options.userId, options.data, options);
}

/**
 * delete a user
 *
 * @param {IDeleteUserParams} options
 * @return {Promise<IUser>}
 */
export async function deleteUser(options: IDeleteUserParams): Promise<IUser> {
  options.token = await authenticateRequest(options);
  return _deleteUser(options.userId, options);
}
