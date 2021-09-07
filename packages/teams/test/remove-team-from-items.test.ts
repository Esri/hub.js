import * as restPortalModule from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import { IModel } from "@esri/hub-common";
import * as removeTeamModule from "../src/remove-team";
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
  let removeTeamSpy: jasmine.Spy;
  let updateItemSpy: jasmine.Spy;

  beforeEach(() => {
    removeTeamSpy = spyOn(removeTeamModule, "removeTeam");
    updateItemSpy = spyOn(restPortalModule, "updateItem");
  });
  afterEach(() => {
    removeTeamSpy.calls.reset();
    updateItemSpy.calls.reset();
  });

  it("Properly removes team and updates item", async () => {
    removeTeamSpy.and.callFake(() => Promise.resolve());
    updateItemSpy.and.callFake(() => Promise.resolve());
    await removeTeamFromItems(
      "1234",
      [firstModel, secondModel],
      true,
      MOCK_USER_SESSION
    );
    expect(removeTeamSpy).toHaveBeenCalled();
    expect(removeTeamSpy.calls.count()).toEqual(1);
    expect(updateItemSpy).toHaveBeenCalled();
    expect(updateItemSpy.calls.count()).toEqual(2);
  });

  it("Does not remove team and does update item", async () => {
    removeTeamSpy.and.callFake(() => Promise.resolve());
    updateItemSpy.and.callFake(() => Promise.resolve());
    await removeTeamFromItems(
      "1234",
      [firstModel, secondModel],
      false,
      MOCK_USER_SESSION
    );
    expect(removeTeamSpy).not.toHaveBeenCalled();
    expect(updateItemSpy).toHaveBeenCalled();
    expect(updateItemSpy.calls.count()).toEqual(2);
  });
});
