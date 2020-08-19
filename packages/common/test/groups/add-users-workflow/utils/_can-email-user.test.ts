import { IUser } from "@esri/arcgis-rest-portal";
import { _canEmailUser } from "../../../../src/groups/add-users-workflow/utils";

describe("_can_email_user", () => {
  it("Returns true when users have the same orgId", () => {
    const user1: IUser = {
      username: "Pinky",
      orgId: "world-domination"
    };
    const user2: IUser = {
      username: "The Brain",
      orgId: "world-domination"
    };

    expect(_canEmailUser(user1, user2)).toEqual(true);
  });

  it("Returns false when users have different orgIds", () => {
    const user1: IUser = {
      username: "Tom",
      orgId: "Cats"
    };
    const user2: IUser = {
      username: "Jerry",
      orgId: "Mice"
    };

    expect(_canEmailUser(user1, user2)).toEqual(false);
  });
});
