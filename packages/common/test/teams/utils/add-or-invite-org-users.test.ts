import { addOrInviteOrgUsers } from "../../../src/teams/utils/add-or-invite-org-users";
import { MOCK_AUTH } from "../fixtures";
import * as processAutoAddUsersModule from "../../../src/teams/utils/process-auto-add-users";
import * as processInviteUsersModule from "../../../src/teams/utils/process-invite-users";
import * as handleNoUsersModule from "../../../src/teams/utils/handle-no-users";
import { IAddOrInviteContext } from "../../../src/teams/types";

describe("addOrInviteOrgUsers: ", () => {
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

    const actual = await addOrInviteOrgUsers(context);
    expect(handleNoUsersSpy).toHaveBeenCalled();
  });
  it("Properly autoAdds when canAutoAdd is supplied", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [{ orgType: "org" }],
      canAutoAddUser: true,
      addUserAsGroupAdmin: false,
      email: undefined,
      world: [],
      org: [{ orgType: "org" }],
      community: [],
    };
    const processAutoAddUsersSpy = spyOn(
      processAutoAddUsersModule,
      "processAutoAddUsers"
    ).and.callFake(() => {
      Promise.resolve();
    });

    const actual = await addOrInviteOrgUsers(context);
    expect(processAutoAddUsersSpy).toHaveBeenCalled();
  });
  it("Properly falls back to inviting users", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [{ orgType: "org" }],
      canAutoAddUser: false,
      addUserAsGroupAdmin: false,
      email: undefined,
      world: [],
      org: [{ orgType: "org" }],
      community: [],
    };
    const processInviteUsersSpy = spyOn(
      processInviteUsersModule,
      "processInviteUsers"
    ).and.callFake(() => {
      Promise.resolve();
    });

    const actual = await addOrInviteOrgUsers(context);
    expect(processInviteUsersSpy).toHaveBeenCalled();
  });
});
