import { handleNoUsers } from "../../src/utils/handle-no-users";

describe("handleNoUsers: ", () => {
  it("returns expected empty addOrInviteReponse object", async () => {
    const result = await handleNoUsers();
    expect(result.notAdded.length).toBe(0);
    expect(result.notEmailed.length).toBe(0);
    expect(result.notInvited.length).toBe(0);
    expect(result.users.length).toBe(0);
    expect(result.errors.length).toBe(0);
  });
});
