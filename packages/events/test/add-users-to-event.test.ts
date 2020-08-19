import { IUser } from "@esri/arcgis-rest-auth";
import * as commonModule from "@esri/hub-common";
import {
  IConsolidatedResult,
  IEmail,
  IHubRequestOptions
} from "@esri/hub-common";

import { addUsersToEvent } from "../src/add-users-to-event";

describe("addUsersToTeam", () => {
  it("Delegates to addUsersToGroup", async () => {
    const teamId = "Saiyans";
    const users: IUser[] = [{ username: "Vegeta" }];
    const primaryRO: IHubRequestOptions = {
      isPortal: false,
      hubApiUrl: "a-url",
      authentication: null
    };
    const email: IEmail = {
      subject: "this is a test",
      body: "body"
    };
    const secondaryRO: IHubRequestOptions = {
      isPortal: false,
      hubApiUrl: "another-url",
      authentication: null
    };

    const expected: IConsolidatedResult = {
      success: true,
      autoAdd: {
        success: true
      }
    };

    const groupSpy = spyOn(commonModule, "addUsersToGroup").and.callFake(() =>
      Promise.resolve(expected)
    );

    const actual = await addUsersToEvent(
      teamId,
      users,
      primaryRO,
      email,
      secondaryRO
    );
    expect(groupSpy).toHaveBeenCalledWith(
      teamId,
      users,
      primaryRO,
      email,
      secondaryRO
    );
    expect(actual).toEqual(expected);
  });
});
