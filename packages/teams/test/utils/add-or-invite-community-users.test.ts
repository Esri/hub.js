import { addOrInviteCommunityUsers } from "../../src/utils/add-or-invite-community-users";
import { MOCK_AUTH } from "../fixtures";
import * as processAutoAddUsersModule from "../../src/utils/process-auto-add-users";
import * as processInviteUsersModule from "../../src/utils/process-invite-users";
import * as handleNoUsersModule from "../../src/utils/handle-no-users";
import { IAddOrInviteContext } from "../../src/types";

describe("addOrInviteCommunityUsers:", () => {
  it("Properly delegates to handleNoUsers when no users supplied", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [],
      canAutoAddUser: false,
      asAdmin: false,
      email: { message: {}, auth: MOCK_AUTH },
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

    const actual = await addOrInviteCommunityUsers(context);
    expect(handleNoUsersSpy).toHaveBeenCalled();
  });
  it("Properly autoAdds when an email is supplied", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [{ modelType: "community" }],
      canAutoAddUser: false,
      asAdmin: false,
      email: { message: {}, auth: MOCK_AUTH },
      world: [],
      org: [],
      community: [{ modelType: "community" }],
    };
    const processAutoAddUsersSpy = spyOn(
      processAutoAddUsersModule,
      "processAutoAddUsers"
    ).and.callFake(() => {
      Promise.resolve();
    });

    const actual = await addOrInviteCommunityUsers(context);
    expect(processAutoAddUsersSpy).toHaveBeenCalled();
  });
  it("Properly autoAdds when canAutoAdd is supplied", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [{ modelType: "community" }],
      canAutoAddUser: true,
      asAdmin: false,
      email: undefined,
      world: [],
      org: [],
      community: [{ modelType: "community" }],
    };
    const processAutoAddUsersSpy = spyOn(
      processAutoAddUsersModule,
      "processAutoAddUsers"
    ).and.callFake(() => {
      Promise.resolve();
    });

    const actual = await addOrInviteCommunityUsers(context);
    expect(processAutoAddUsersSpy).toHaveBeenCalled();
  });
  it("Properly falls back to inviting users", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [{ modelType: "community" }],
      canAutoAddUser: false,
      asAdmin: false,
      email: undefined,
      world: [],
      org: [],
      community: [{ modelType: "community" }],
    };
    const processInviteUsersSpy = spyOn(
      processInviteUsersModule,
      "processInviteUsers"
    ).and.callFake(() => {
      Promise.resolve();
    });

    const actual = await addOrInviteCommunityUsers(context);
    expect(processInviteUsersSpy).toHaveBeenCalled();
  });
});
