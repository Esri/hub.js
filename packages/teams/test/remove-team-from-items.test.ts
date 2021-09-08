import * as restPortalModule from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import { IModel } from "@esri/hub-common";
import { removeTeamFromItems } from "../src/remove-team-from-items";

const TOMORROW = (function () {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

const MOCK_USER_SESSION = new UserSession({
  username: "casey",
  password: "123456",
  token: "fake-token",
  tokenExpires: TOMORROW,
});

describe("remove-team-from-items", function () {
  const firstModel: IModel = {
    item: {
      id: "someId",
      protected: false,
      itemControl: "admin",
      owner: "owner",
      created: 123,
      modified: 123,
      tags: [],
      numViews: 3,
      size: 3,
      title: "title",
      type: "Hub Site Application",
      properties: {
        teams: ["1234", "5678"],
      },
    },
    data: { foo: "bar", baz: { boop: "beep" } },
  };
  const secondModel: IModel = {
    item: {
      id: "someId2",
      protected: false,
      owner: "owner",
      itemControl: "update",
      created: 123,
      modified: 123,
      tags: [],
      numViews: 3,
      size: 3,
      title: "title",
      type: "Hub Site Application",
      properties: {
        teams: ["1234", "bobbobbob"],
      },
    },
    data: { foo: "bar", baz: { boop: "beep" } },
  };
  const thirdModel: IModel = {
    item: {
      id: "someId2",
      protected: false,
      owner: "owner",
      created: 123,
      modified: 123,
      tags: [],
      numViews: 3,
      size: 3,
      title: "title",
      type: "Hub Site Application",
      properties: {
        teams: ["1234", "bobbobbob"],
      },
    },
    data: { foo: "bar", baz: { boop: "beep" } },
  };
  let updateItemSpy: jasmine.Spy;

  beforeEach(() => {
    updateItemSpy = spyOn(restPortalModule, "updateItem");
  });
  afterEach(() => {
    updateItemSpy.calls.reset();
  });

  it("Properly removes team and updates item", async () => {
    updateItemSpy.and.callFake(() => Promise.resolve());
    await removeTeamFromItems(
      "1234",
      [firstModel, secondModel, thirdModel],
      MOCK_USER_SESSION
    );

    expect(updateItemSpy).toHaveBeenCalled();
    expect(updateItemSpy.calls.count()).toEqual(2);
  });
});
