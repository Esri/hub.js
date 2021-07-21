import { addOrInviteWorldUsers } from "../../src/utils/add-or-invite-world-users";
import { MOCK_AUTH } from "../fixtures";
import * as processInviteUsersModule from "../../src/utils/process-invite-users";
import * as handleNoUsersModule from "../../src/utils/handle-no-users";
import { IAddOrInviteContext } from "../../src/types";

describe("addOrInviteWorldUsers: ", () => {
  it("Properly delegates to handleNoUsers when no users supplied", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [],
      canAutoAddUser: false,
      addUserAsGroupAdmin: false,
      email: undefined,
      world: [],
      org: [],
      community: [],
    };
    const handleNoUsersSpy = spyOn(
      handleNoUsersModule,
      "handleNoUsers"
    ).and.callFake(() => {
      Promise.resolve();
    });

    const actual = await addOrInviteWorldUsers(context);
    expect(handleNoUsersSpy).toHaveBeenCalled();
  });
  it("Properly falls back to inviting users", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [{ modelType: "world" }],
      canAutoAddUser: false,
      addUserAsGroupAdmin: false,
      email: undefined,
      world: [{ modelType: "world" }],
      org: [],
      community: [],
    };
    const processInviteUsersSpy = spyOn(
      processInviteUsersModule,
      "processInviteUsers"
    ).and.callFake(() => {
      Promise.resolve();
    });

    const actual = await addOrInviteWorldUsers(context);
    expect(processInviteUsersSpy).toHaveBeenCalled();
  });
});
