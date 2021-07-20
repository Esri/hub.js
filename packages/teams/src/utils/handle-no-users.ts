import { IAddOrInviteResponse } from "../types";

export function handleNoUsers(): IAddOrInviteResponse {
  return {
    notAdded: [],
    notEmailed: [],
    notInvited: [],
    users: [],
    errors: [],
  };
}
