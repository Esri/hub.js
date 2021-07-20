import { ITeamsStatus } from "../../src/types";
import { teamsToAddUsersTo } from "../../src/utils/teams-to-add-users-to";

describe("teamsToAddUsersTo: ", () => {
  it("If it is not a core team and we dont have teamsStatus...", () => {
    const result = teamsToAddUsersTo(["abc123"], false);
    expect(result.length).toBe(1);
  });
  it("handles things when teamstatus is passed in, but not core team", () => {
    const teamsStatus: ITeamsStatus = {
      core: {
        id: "abc1234",
        isOk: true,
        isMissing: false,
        isBroken: false,
        canFix: true,
        isMember: true,
      },
      followers: {
        id: "abc345",
        isOk: true,
        isMissing: false,
        isBroken: false,
        canFix: true,
        isMember: true,
      },
      content: {
        id: "abc678",
        isOk: true,
        isMissing: false,
        isBroken: false,
        canFix: true,
        isMember: true,
      },
    };
    const result = teamsToAddUsersTo(["zyx543"], false, teamsStatus);
    expect(result.length).toBe(1);
  });
  it("handles things when teamsStatus is passed in and it is a core team", () => {
    const teamsStatus: ITeamsStatus = {
      core: {
        id: "abc1234",
        isOk: true,
        isMissing: false,
        isBroken: false,
        canFix: true,
        isMember: true,
      },
      followers: {
        id: "abc345",
        isOk: true,
        isMissing: false,
        isBroken: false,
        canFix: true,
        isMember: true,
      },
      content: {
        id: "abc678",
        isOk: true,
        isMissing: false,
        isBroken: false,
        canFix: true,
        isMember: true,
      },
    };
    const result = teamsToAddUsersTo(["abc1234"], true, teamsStatus);
    expect(result.length).toBe(3);
  });
  it("handles things when one of the teams in teamsStatus is not ok..", () => {
    const teamsStatus: ITeamsStatus = {
      core: {
        id: "abc1234",
        isOk: true,
        isMissing: false,
        isBroken: false,
        canFix: true,
        isMember: true,
      },
      followers: {
        id: "abc345",
        isOk: false,
        isMissing: true,
        isBroken: false,
        canFix: true,
        isMember: true,
      },
      content: {
        id: "abc678",
        isOk: true,
        isMissing: false,
        isBroken: false,
        canFix: true,
        isMember: true,
      },
    };
    const result = teamsToAddUsersTo(["abc1234"], true, teamsStatus);
    expect(result.length).toBe(2);
  });
});
