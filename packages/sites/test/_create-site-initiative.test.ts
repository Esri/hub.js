import { _createSiteInitiative } from "../src";
import * as initiativeModule from "@esri/hub-initiatives";
import * as portalModule from "@esri/arcgis-rest-portal";
import {
  IHubRequestOptions,
  IModelTemplate,
  IInitiativeModel,
  cloneObject
} from "@esri/hub-common";
import { expectAllCalled } from "./test-helpers.test";

describe("_createSiteInitiative", () => {
  const tmpl = ({
    item: {},
    data: {},
    properties: {
      initiativeTemplate: {
        item: {
          typeKeywords: ["Hub Initiative Template", "Other Keyword"],
          properties: {},
          verifyInterpolation: "{{some.var}}"
        },
        data: {}
      }
    }
  } as unknown) as IModelTemplate;

  const settings: any = {
    some: {
      var: "foobar"
    },
    teams: {
      collaborationGroupId: "123"
    },
    solution: {
      url: "solution-url",
      title: "solution-title"
    }
  };

  const transforms = {};

  const ro = {
    authentication: {
      username: "tate"
    }
  } as IHubRequestOptions;

  const itemId = "abceddrser";

  let addSpy: jasmine.Spy;
  let shareSpy: jasmine.Spy;
  beforeEach(() => {
    addSpy = spyOn(initiativeModule, "addInitiative").and.callFake(
      (model: IInitiativeModel) => {
        model.item.id = itemId;
        return Promise.resolve(model);
      }
    );

    shareSpy = spyOn(portalModule, "shareItemWithGroup").and.returnValue(
      Promise.resolve()
    );
  });

  it("creates an initiative for a site", async () => {
    const created = await _createSiteInitiative(tmpl, settings, transforms, ro);

    expect(created.item.url).toBe(settings.solution.url);
    expect(created.item.title).toBe(settings.solution.title);
    expect(created.item.owner).toBe(ro.authentication.username);
    expect(created.item.typeKeywords).toEqual(["Other Keyword"]);
    expect(created.item.type).toBe("Hub Initiative");
    expect(created.item.properties).toEqual({
      collaborationGroupId: "123"
    });
    expect(created.item.id).toBe(itemId);

    expectAllCalled([addSpy, shareSpy], expect);
    expect(shareSpy.calls.argsFor(0)[0].id).toBe(itemId);
    expect(shareSpy.calls.argsFor(0)[0].groupId).toBe(
      settings.teams.collaborationGroupId,
      "shared to collab group"
    );
  });

  it("doesnt share with collab group when no id", async () => {
    const localSettings = cloneObject(settings);
    localSettings.teams = {};

    const created = await _createSiteInitiative(
      tmpl,
      localSettings,
      transforms,
      ro
    );

    expect(created.item.properties).toEqual({});
    expect(addSpy).toHaveBeenCalled();
    expect(shareSpy).not.toHaveBeenCalled();
  });

  it("rejects if something blows up", async () => {
    addSpy.and.returnValue(Promise.reject());

    try {
      await _createSiteInitiative(tmpl, settings, transforms, ro);
      fail("should reject");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
