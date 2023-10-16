import { addOrInviteCollaborationCoordinators } from "../../src/utils/add-or-invite-collaboration-coordinators";
import { MOCK_AUTH } from "../fixtures";
import * as processAutoAddUsersModule from "../../src/utils/process-auto-add-users";
import * as handleNoUsersModule from "../../src/utils/handle-no-users";
import { IAddOrInviteContext } from "../../src/types";

describe("addOrInviteCollaborationCoordinators: ", () => {
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
      partnered: [],
      collaborationCoordinator: [],
    };
    const handleNoUsersSpy = spyOn(
      handleNoUsersModule,
      "handleNoUsers"
    ).and.callFake(() => {
      Promise.resolve();
    });

    const actual = await addOrInviteCollaborationCoordinators(context);
    expect(handleNoUsersSpy).toHaveBeenCalled();
  });
  it("Properly autoAdds when canAutoAdd is supplied", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [{ orgType: "collaborationCoordinator" }],
      canAutoAddUser: true,
      addUserAsGroupAdmin: false,
      email: undefined,
      world: [],
      org: [],
      community: [],
      partnered: [],
      collaborationCoordinator: [{ orgType: "collaborationCoordinator" }],
    };
    const processAutoAddUsersSpy = spyOn(
      processAutoAddUsersModule,
      "processAutoAddUsers"
    ).and.callFake(() => {
      Promise.resolve();
    });

    const actual = await addOrInviteCollaborationCoordinators(context);
    expect(processAutoAddUsersSpy).toHaveBeenCalled();
  });
});
