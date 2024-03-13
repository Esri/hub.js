import * as portalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as modelUtils from "../../src/models";
import { IModel } from "../../src/types";
import { deleteSurvey, updateSurvey } from "../../src/surveys/edit";
import * as getFormJsonUtil from "../../src/surveys/utils/get-form-json";
import { IHubSurvey } from "../../src/core/types/IHubSurvey";

const GUID = "9b77674e43cf4bbd9ecad5189b3f1fdc";

describe("survey editing:", () => {
  beforeAll(() => {
    // suppress deprecation warnings
    // tslint:disable-next-line: no-empty
    spyOn(console, "warn").and.callFake(() => {});
  });
  describe("update survey:", () => {
    let getItemSpy: jasmine.Spy;
    let getFormJsonSpy: jasmine.Spy;
    let updateModelSpy: jasmine.Spy;
    beforeEach(() => {
      getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve({
          item: {
            typeKeywords: [],
          },
        })
      );
      getFormJsonSpy = spyOn(getFormJsonUtil, "getFormJson").and.callFake(() =>
        Promise.resolve({ questions: [] })
      );
      updateModelSpy = spyOn(modelUtils, "updateModel").and.callFake(
        (m: IModel) => {
          return Promise.resolve(m);
        }
      );
    });
    afterEach(() => {
      getItemSpy.calls.reset();
      getFormJsonSpy.calls.reset();
      updateModelSpy.calls.reset();
    });
    it("converts to a model and updates the item", async () => {
      const survey: IHubSurvey = {
        itemControl: "edit",
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        orgUrlKey: "dcdev",
        owner: "dcdev_dude",
        type: "Form",
        createdDate: new Date(1595878748000),
        createdDateSource: "item.created",
        updatedDate: new Date(1595878750000),
        updatedDateSource: "item.modified",
        thumbnailUrl: "",
        permissions: [],
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
        location: { type: "none" },
        licenseInfo: "",
        hasMapQuestion: false,
        displayMap: false,
      };
      const chk = await updateSurvey(survey, { authentication: MOCK_AUTH });
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      expect(getItemSpy.calls.count()).toBe(1);
      expect(getFormJsonSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.item.description).toBe(survey.description);
    });
    it("handles when a location is explicitly set", async () => {
      const survey: IHubSurvey = {
        itemControl: "edit",
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        orgUrlKey: "dcdev",
        owner: "dcdev_dude",
        type: "Form",
        createdDate: new Date(1595878748000),
        createdDateSource: "item.created",
        updatedDate: new Date(1595878750000),
        updatedDateSource: "item.modified",
        thumbnailUrl: "",
        permissions: [],
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
        location: { type: "item" },
        licenseInfo: "",
        hasMapQuestion: false,
        displayMap: false,
      };
      const chk = await updateSurvey(survey, { authentication: MOCK_AUTH });
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      expect(getItemSpy.calls.count()).toBe(1);
      expect(getFormJsonSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.item.description).toBe(survey.description);
    });
  });
  describe("delete survey", () => {
    it("deletes the item", async () => {
      const removeSpy = spyOn(portalModule, "removeItem").and.returnValue(
        Promise.resolve({ success: true })
      );

      const result = await deleteSurvey("3ef", {
        authentication: MOCK_AUTH,
      });
      expect(result).toBeUndefined();
      expect(removeSpy.calls.count()).toBe(1);
      expect(removeSpy.calls.argsFor(0)[0].authentication).toBe(MOCK_AUTH);
      expect(removeSpy.calls.argsFor(0)[0].id).toBe("3ef");
    });
  });
});
