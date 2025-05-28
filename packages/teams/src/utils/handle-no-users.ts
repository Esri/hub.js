import { IAddOrInviteContext, IAddOrInviteResponse } from "../types";

/**
 * @private
 * Returns an empty instance of the addorinviteresponse object.
 * We are using this because if you leave out any of the props
 * from the final object and you are concatting together arrays you can concat
 * an undeifined inside an array which will throw off array lengths.
 *
 * @export
 * @return {IAddOrInviteResponse}
 */
export function handleNoUsers(
  _context?: IAddOrInviteContext,
  _userType?: "world" | "org" | "community" | "partnered",
  _shouldEmail?: boolean
): Promise<IAddOrInviteResponse> {
  const response: IAddOrInviteResponse = {
    notAdded: [],
    notEmailed: [],
    notInvited: [],
    users: [],
    errors: [],
  };
  return Promise.resolve(response);
}
