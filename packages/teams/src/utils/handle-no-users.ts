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
export async function handleNoUsers(
  context?: IAddOrInviteContext,
  userType?: "world" | "org" | "community" | "partnered",
  shouldEmail?: boolean
): Promise<IAddOrInviteResponse> {
  return {
    notAdded: [],
    notEmailed: [],
    notInvited: [],
    users: [],
    errors: [],
  };
}
