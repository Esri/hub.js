import {
  IModel,
  IS123FormJSON,
  MAP_SURVEY_TYPEKEYWORD,
  cloneObject,
  decodeForm,
  getFormInfoJson,
  getFormJson,
  getInputFeatureServiceModel,
  getMapQuestion,
  getSourceFeatureServiceModelFromFieldworker,
  getStakeholderModel,
  getSurveyModels,
  hasMapQuestion,
  isFieldworkerView,
  isMapQuestion,
  isPageQuestion,
  isSurvey123Connect,
  setDisplayMapKeyword,
  shouldDisplayMap,
} from "@esri/hub-common";
import * as surveyUtils from "../../src/surveys/utils";
import * as restPortal from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { mockUserSession } from "../test-helpers/fake-user-session";
import * as FieldworkerItem from "../mocks/items/fieldworker-item.json";
import * as FeatureServiceItem from "../mocks/items/feature-service-item.json";
import * as StakeholderItem from "../mocks/items/stakeholder-item.json";
import * as FormItemPublished from "../mocks/items/form-item-published.json";

describe("survey utils", () => {
  let requestOptions: IRequestOptions;

  beforeEach(() => {
    requestOptions = { authentication: mockUserSession };
  });

  describe("decodeForm", () => {
    const form: IS123FormJSON = {
      header: {
        content:
          "%3Cp%20title%3D'Whos%20the%20best%20cat'%3EWhos%20the%20best%20cat%3C%2Fp%3E",
      },
      subHeader: {
        content: "This%20is%20encoded",
      },
      footer: {
        content: "This%20is%20encoded",
      },
      questions: [
        {
          id: "some id",
          type: "esriQuestionTypePage",
          questions: [
            {
              description: "This%20is%20encoded",
              id: "some id",
              type: "esriQuestionTypePage",
            },
            {
              id: "some id",
              type: "esriQuestionTypePage",
            },
          ],
        },
      ],
      settings: {
        thankYouScreenContent: "This%20is%20encoded",
      },
    };

    it("decodes form into HTML", () => {
      const result: IS123FormJSON = decodeForm(form);
      expect(result).toEqual({
        header: {
          content: "<p title='Whos the best cat'>Whos the best cat</p>",
        },
        subHeader: {
          content: "This is encoded",
        },
        footer: {
          content: "This is encoded",
        },
        questions: [
          {
            id: "some id",
            type: "esriQuestionTypePage",
            questions: [
              {
                description: "This is encoded",
                id: "some id",
                type: "esriQuestionTypePage",
              },
              {
                id: "some id",
                type: "esriQuestionTypePage",
              },
            ],
          },
        ],
        settings: {
          thankYouScreenContent: "This is encoded",
        },
      });
    });
  });

  // describe("getFormInfoJson", () => {
  //   let getItemInfoSpy;
  //   beforeEach(() => {
  //     getItemInfoSpy = spyOn(restPortal, "getItemInfo").and.returnValue(Promise.resolve({ name: 'my form' }));
  //   });

  //   it("calls getItemInfo with expected parameters", async () => {
  //     await getFormInfoJson('some id', requestOptions);
  //     expect(getItemInfoSpy).toHaveBeenCalledWith('some id', { fileName: 'forminfo.json', readAs: 'json', authentication: mockUserSession });
  //   })
  // });

  describe("getFormJson", () => {
    beforeEach(() => {
      spyOn(surveyUtils, "getFormInfoJson").and.callFake(() => {
        return Promise.resolve({ name: "my form" });
      });
    });

    it("get form json", async () => {
      spyOn(restPortal, "getItemInfo").and.returnValue(
        Promise.resolve({ questions: [{ description: "hello%20world" }] })
      );
      const survey = { id: "3ef" } as any as restPortal.IItem;
      const result = await getFormJson(survey, requestOptions);
      expect(result).toEqual({ questions: [{ description: "hello world" }] });
    });

    it("get form json when created by survey123", async () => {
      spyOn(restPortal, "getItemInfo").and.returnValue(
        Promise.resolve({ questions: [{ description: "hello%20world" }] })
      );
      const survey = {
        id: "3ef",
        typeKeywords: ["Survey123 Connect"],
      } as any as restPortal.IItem;
      const result = await getFormJson(survey, requestOptions);
      expect(result).toEqual({
        settings: {
          openStatusInfo: {
            status: "open",
            schedule: { end: null, status: null },
          },
          multiSubmissionInfo: { maxAllowed: 0 },
        },
        questions: [],
      });
    });

    xit("handle when form is null", async () => {
      spyOn(restPortal, "getItemInfo").and.returnValues(Promise.resolve(null));
      const survey = { id: "3ef" } as any as restPortal.IItem;
      const result = await getFormJson(survey, requestOptions);
      expect(result).toEqual({});
    });
  });

  describe("getInputFeatureServiceModel", () => {
    let getRelatedItemsResponse: restPortal.IGetRelatedItemsResponse;

    beforeEach(() => {
      getRelatedItemsResponse = {
        total: 1,
        relatedItems: [FieldworkerItem],
      };
    });

    it("should resolve undefined when getRelatedItems returns no related items", async function () {
      getRelatedItemsResponse.relatedItems.splice(0, 1);
      const getRelatedItemsSpy = spyOn(
        restPortal,
        "getRelatedItems"
      ).and.returnValue(Promise.resolve(getRelatedItemsResponse));
      const result = await getInputFeatureServiceModel("123", mockUserSession);
      expect(getRelatedItemsSpy.calls.count()).toBe(1);
      expect(getRelatedItemsSpy.calls.argsFor(0)).toEqual([
        {
          id: "123",
          relationshipType: "Survey2Service",
          direction: "forward",
          ...mockUserSession,
        },
      ]);
      expect(result).toBeUndefined();
    });

    it("should resolve an IModel when getRelatedItems returns related items", async function () {
      const getRelatedItemsSpy = spyOn(
        restPortal,
        "getRelatedItems"
      ).and.returnValue(Promise.resolve(getRelatedItemsResponse));
      const result = await getInputFeatureServiceModel("123", mockUserSession);
      expect(getRelatedItemsSpy.calls.count()).toBe(1);
      expect(getRelatedItemsSpy.calls.argsFor(0)).toEqual([
        {
          id: "123",
          relationshipType: "Survey2Service",
          direction: "forward",
          ...mockUserSession,
        },
      ]);
      const expected = { item: FieldworkerItem };
      expect(result).toEqual(expected);
    });
  });

  describe("getMapQuestion", () => {
    it("gets map question", () => {
      const questions = [
        {
          id: "some id 4",
          type: "esriQuestionTypePage",
          questions: [
            {
              id: "some id",
              type: "invalid type",
            },
          ],
        },
        {
          id: "some id 1",
          type: "esriQuestionTypePage",
          questions: [
            {
              id: "some id 2",
              type: "esriQuestionTypePolygon",
              maps: [
                {
                  type: "map type",
                  itemId: "an id",
                  name: "a map",
                },
              ],
              defaultMap: "a map",
            },
          ],
        },
        {
          id: "some id 3",
          type: "esriQuestionTypePage",
          questions: [],
        },
      ];

      const result = getMapQuestion(questions);
      expect(result).toEqual({
        id: "some id 2",
        type: "esriQuestionTypePolygon",
        maps: [
          {
            type: "map type",
            itemId: "an id",
            name: "a map",
          },
        ],
        defaultMap: "a map",
      });
    });

    it("handles null input", () => {
      const result = getMapQuestion([]);
      expect(result).toBeFalsy();
    });
  });

  describe("getSourceFeatureServiceModelFromFieldworker", () => {
    let getRelatedItemsResponse: restPortal.IGetRelatedItemsResponse;

    beforeEach(() => {
      getRelatedItemsResponse = {
        total: 1,
        relatedItems: [FeatureServiceItem],
      };
    });

    it("should resolve undefined when getRelatedItems returns no related items", async function () {
      getRelatedItemsResponse.relatedItems.splice(0, 1);
      const getRelatedItemsSpy = spyOn(
        restPortal,
        "getRelatedItems"
      ).and.returnValue(Promise.resolve(getRelatedItemsResponse));
      const result = await getSourceFeatureServiceModelFromFieldworker(
        "123",
        mockUserSession
      );
      expect(getRelatedItemsSpy.calls.count()).toBe(1);
      expect(getRelatedItemsSpy.calls.argsFor(0)).toEqual([
        {
          id: "123",
          relationshipType: "Service2Data",
          direction: "forward",
          ...mockUserSession,
        },
      ]);
      expect(result).toBeUndefined();
    });

    it("should resolve an IModel when getRelatedItems returns related items", async function () {
      const getRelatedItemsSpy = spyOn(
        restPortal,
        "getRelatedItems"
      ).and.returnValue(Promise.resolve(getRelatedItemsResponse));
      const result = await getSourceFeatureServiceModelFromFieldworker(
        "123",
        mockUserSession
      );
      expect(getRelatedItemsSpy.calls.count()).toBe(1);
      expect(getRelatedItemsSpy.calls.argsFor(0)).toEqual([
        {
          id: "123",
          relationshipType: "Service2Data",
          direction: "forward",
          ...mockUserSession,
        },
      ]);
      const expected = { item: FeatureServiceItem };
      expect(result).toEqual(expected);
    });
  });

  describe("getStakeholderModel", () => {
    let getRelatedItemsResponse: restPortal.IGetRelatedItemsResponse;

    beforeEach(() => {
      getRelatedItemsResponse = {
        total: 2,
        relatedItems: [StakeholderItem],
      };
    });

    it("should resolve undefined when getRelatedItems returns no Stakeholder", async function () {
      getRelatedItemsResponse.relatedItems.pop();
      const getRelatedItemsSpy = spyOn(
        restPortal,
        "getRelatedItems"
      ).and.returnValue(Promise.resolve(getRelatedItemsResponse));
      const result = await getStakeholderModel("123", mockUserSession);
      expect(getRelatedItemsSpy.calls.count()).toBe(1);
      expect(getRelatedItemsSpy.calls.argsFor(0)).toEqual([
        {
          id: "123",
          relationshipType: "Survey2Data",
          direction: "forward",
          ...mockUserSession,
        },
      ]);
      expect(result).toBeUndefined();
    });

    it("should resolve an IModel when getRelatedItems returns a Stakeholder", async function () {
      const getRelatedItemsSpy = spyOn(
        restPortal,
        "getRelatedItems"
      ).and.returnValue(Promise.resolve(getRelatedItemsResponse));
      const result = await getStakeholderModel("123", mockUserSession);
      expect(getRelatedItemsSpy.calls.count()).toBe(1);
      expect(getRelatedItemsSpy.calls.argsFor(0)).toEqual([
        {
          id: "123",
          relationshipType: "Survey2Data",
          direction: "forward",
          ...mockUserSession,
        },
      ]);
      const expected = { item: StakeholderItem };
      expect(result).toEqual(expected);
    });
  });

  xdescribe("getSurveyModels", () => {
    let formModel: IModel;
    let featureServiceModel: IModel;
    let fieldworkerModel: IModel;
    let stakeholderModel: IModel;

    beforeEach(() => {
      formModel = { item: FormItemPublished };
      featureServiceModel = { item: FeatureServiceItem };
      fieldworkerModel = { item: FieldworkerItem };
      stakeholderModel = { item: StakeholderItem };
    });

    it("fetches the feature service when a fieldworker is the primary input service", async function () {
      const getItemStub = spyOn(restPortal, "getItem").and.returnValue(
        Promise.resolve(FormItemPublished)
      );
      const isFieldworkerViewSpy = spyOn(
        surveyUtils,
        "isFieldworkerView"
      ).and.returnValue(true);
      const getInputFeatureServiceModelSpy = spyOn(
        surveyUtils,
        "getInputFeatureServiceModel"
      ).and.returnValue(Promise.resolve(fieldworkerModel));
      const getSourceFeatureServiceModelFromFieldworkerSpy = spyOn(
        surveyUtils,
        "getSourceFeatureServiceModelFromFieldworker"
      ).and.returnValue(Promise.resolve(featureServiceModel));
      const getStakeholderModelSpy = spyOn(
        surveyUtils,
        "getStakeholderModel"
      ).and.returnValue(Promise.resolve(stakeholderModel));
      const results = await getSurveyModels(formModel.item.id, requestOptions);
      expect(getItemStub.calls.count()).toBe(1);
      expect(getItemStub.calls.argsFor(0)).toEqual([
        FormItemPublished.id,
        requestOptions,
      ]);
      expect(getInputFeatureServiceModelSpy.calls.count()).toBe(1);
      expect(getInputFeatureServiceModelSpy.calls.argsFor(0)).toEqual([
        formModel.item.id,
        requestOptions,
      ]);
      expect(getSourceFeatureServiceModelFromFieldworkerSpy.calls.count()).toBe(
        1
      );
      expect(
        getSourceFeatureServiceModelFromFieldworkerSpy.calls.argsFor(0)
      ).toEqual([FieldworkerItem.id, requestOptions]);
      expect(isFieldworkerViewSpy.calls.count()).toBe(1);
      expect(isFieldworkerViewSpy.calls.argsFor(0)).toEqual([
        fieldworkerModel.item,
      ]);
      expect(getStakeholderModelSpy.calls.count()).toBe(1);
      expect(getStakeholderModelSpy.calls.argsFor(0)).toEqual([
        FormItemPublished.id,
        requestOptions,
      ]);
      expect(results.form).toEqual(formModel);
      expect(results.featureService).toEqual(featureServiceModel);
      expect(results.fieldworker).toEqual(fieldworkerModel);
      expect(results.stakeholder).toEqual(stakeholderModel);
    });

    it("does not attempt to fetch the feature service when the feature service is resolved from getInputFeatureServiceModel", async function () {
      const getItemStub = spyOn(restPortal, "getItem").and.returnValue(
        Promise.resolve(FormItemPublished)
      );
      const isFieldworkerViewSpy = spyOn(
        surveyUtils,
        "isFieldworkerView"
      ).and.returnValue(false);
      const getInputFeatureServiceModelSpy = spyOn(
        surveyUtils,
        "getInputFeatureServiceModel"
      ).and.returnValue(Promise.resolve(featureServiceModel));
      const getSourceFeatureServiceModelFromFieldworkerSpy = spyOn(
        surveyUtils,
        "getSourceFeatureServiceModelFromFieldworker"
      );
      const getStakeholderModelSpy = spyOn(
        surveyUtils,
        "getStakeholderModel"
      ).and.returnValue(Promise.resolve());
      const results = await getSurveyModels(formModel.item.id, requestOptions);
      expect(getItemStub.calls.count()).toBe(1);
      expect(getItemStub.calls.argsFor(0)).toEqual([
        FormItemPublished.id,
        requestOptions,
      ]);
      expect(getInputFeatureServiceModelSpy.calls.count()).toBe(1);
      expect(getInputFeatureServiceModelSpy.calls.argsFor(0)).toEqual([
        formModel.item.id,
        requestOptions,
      ]);
      expect(getSourceFeatureServiceModelFromFieldworkerSpy.calls.count()).toBe(
        0
      );
      expect(isFieldworkerViewSpy.calls.count()).toBe(1);
      expect(isFieldworkerViewSpy.calls.argsFor(0)).toEqual([
        featureServiceModel.item,
      ]);
      expect(getStakeholderModelSpy.calls.count()).toBe(1);
      expect(getStakeholderModelSpy.calls.argsFor(0)).toEqual([
        FormItemPublished.id,
        requestOptions,
      ]);
      expect(results.form).toEqual(formModel);
      expect(results.featureService).toEqual(featureServiceModel);
      expect(results.fieldworker).toBeUndefined();
      expect(results.stakeholder).toBeUndefined();
    });

    it("does not attempt to fetch the feature service when nothing is resolved from getInputFeatureServiceModel", async function () {
      const getItemStub = spyOn(restPortal, "getItem").and.returnValue(
        Promise.resolve(FormItemPublished)
      );
      const isFieldworkerViewSpy = spyOn(
        surveyUtils,
        "isFieldworkerView"
      ).and.returnValue(false);
      const getInputFeatureServiceModelSpy = spyOn(
        surveyUtils,
        "getInputFeatureServiceModel"
      ).and.returnValue(Promise.resolve());
      const getSourceFeatureServiceModelFromFieldworkerSpy = spyOn(
        surveyUtils,
        "getSourceFeatureServiceModelFromFieldworker"
      );
      const getStakeholderModelSpy = spyOn(
        surveyUtils,
        "getStakeholderModel"
      ).and.returnValue(Promise.resolve());
      const results = await getSurveyModels(formModel.item.id, requestOptions);
      expect(getItemStub.calls.count()).toBe(1);
      expect(getItemStub.calls.argsFor(0)).toEqual([
        FormItemPublished.id,
        requestOptions,
      ]);
      expect(getInputFeatureServiceModelSpy.calls.count()).toBe(1);
      expect(getInputFeatureServiceModelSpy.calls.argsFor(0)).toEqual([
        formModel.item.id,
        requestOptions,
      ]);
      expect(getSourceFeatureServiceModelFromFieldworkerSpy.calls.count()).toBe(
        0
      );
      expect(isFieldworkerViewSpy.calls.count()).toBe(0);
      expect(getStakeholderModelSpy.calls.count()).toBe(1);
      expect(getStakeholderModelSpy.calls.argsFor(0)).toEqual([
        FormItemPublished.id,
        requestOptions,
      ]);
      expect(results.form).toEqual(formModel);
      expect(results.featureService).toBeUndefined();
      expect(results.fieldworker).toBeUndefined();
      expect(results.stakeholder).toBeUndefined();
    });

    it("only fetches Form when formItemOrId is a string", async function () {
      const getItemStub = spyOn(restPortal, "getItem");
      const isFieldworkerViewSpy = spyOn(
        surveyUtils,
        "isFieldworkerView"
      ).and.returnValue(true);
      const getInputFeatureServiceModelSpy = spyOn(
        surveyUtils,
        "getInputFeatureServiceModel"
      ).and.returnValue(Promise.resolve(fieldworkerModel));
      const getSourceFeatureServiceModelFromFieldworkerSpy = spyOn(
        surveyUtils,
        "getSourceFeatureServiceModelFromFieldworker"
      ).and.returnValue(Promise.resolve(featureServiceModel));
      const getStakeholderModelSpy = spyOn(
        surveyUtils,
        "getStakeholderModel"
      ).and.returnValue(Promise.resolve(stakeholderModel));
      const results = await getSurveyModels(formModel.item, requestOptions);
      expect(getItemStub.calls.count()).toBe(0);
      expect(getInputFeatureServiceModelSpy.calls.count()).toBe(1);
      expect(getInputFeatureServiceModelSpy.calls.argsFor(0)).toEqual([
        formModel.item.id,
        requestOptions,
      ]);
      expect(getSourceFeatureServiceModelFromFieldworkerSpy.calls.count()).toBe(
        1
      );
      expect(
        getSourceFeatureServiceModelFromFieldworkerSpy.calls.argsFor(0)
      ).toEqual([FieldworkerItem.id, requestOptions]);
      expect(isFieldworkerViewSpy.calls.count()).toBe(1);
      expect(isFieldworkerViewSpy.calls.argsFor(0)).toEqual([
        fieldworkerModel.item,
      ]);
      expect(getStakeholderModelSpy.calls.count()).toBe(1);
      expect(getStakeholderModelSpy.calls.argsFor(0)).toEqual([
        FormItemPublished.id,
        requestOptions,
      ]);
      expect(results.form).toEqual(formModel);
      expect(results.featureService).toEqual(featureServiceModel);
      expect(results.fieldworker).toEqual(fieldworkerModel);
      expect(results.stakeholder).toEqual(stakeholderModel);
    });
  });

  describe("hasMapQuestion", () => {
    it("correctly identifies presence of map question", () => {
      const result = hasMapQuestion([
        {
          id: "some id",
          type: "esriQuestionTypePolygon",
          maps: [
            {
              type: "map type",
              itemId: "an id",
              name: "a map",
            },
          ],
          defaultMap: "a map",
        },
      ]);

      expect(result).toBeTruthy();
    });
  });

  describe("isFieldworkerView", () => {
    it("should return true for a Fieldworker", function () {
      expect(isFieldworkerView(FieldworkerItem)).toBe(true);
    });

    it("should support legacy Fieldworkers", function () {
      const item = {
        ...cloneObject(FieldworkerItem),
        typeKeywords: ["Survey123", "Feature Service", "View Service"],
      };
      expect(isFieldworkerView(item)).toBe(true);
    });

    it("should return false for a Feature Service", function () {
      expect(isFieldworkerView(FeatureServiceItem)).toBe(false);
    });

    it("should return false for a Stakeholder", function () {
      expect(isFieldworkerView(StakeholderItem)).toBe(false);
    });
  });

  describe("isMapQuestion", () => {
    it("correctly identifies map question when maps are set", () => {
      const result = isMapQuestion({
        id: "some id",
        type: "esriQuestionTypePolygon",
        maps: [
          {
            type: "map type",
            itemId: "an id",
            name: "a map",
          },
        ],
      });

      expect(result).toBeTruthy();
    });

    it("correctly identifies map question when defaultMap is set", () => {
      const result = isMapQuestion({
        id: "some id",
        type: "esriQuestionTypePolygon",
        defaultMap: "a map",
      });

      expect(result).toBeTruthy();
    });

    it("correctly indicates non-map question", () => {
      const result = isMapQuestion({
        id: "some id",
        type: "esriQuestionTypePage",
      });

      expect(result).toBeFalsy();
    });
  });

  describe("isPageQuestion", () => {
    it("correctly identifies page question", () => {
      const result = isPageQuestion({
        id: "some id",
        type: "esriQuestionTypePage",
      });

      expect(result).toBeTruthy();
    });

    it("correctly indicates non-page question", () => {
      const result = isPageQuestion({
        id: "some id",
        type: "esriQuestionTypePolygon",
        maps: [
          {
            type: "map type",
            itemId: "an id",
            name: "a map",
          },
        ],
      });

      expect(result).toBeFalsy();
    });
  });

  describe("isSurvey123Connect", () => {
    it("correctly identifies survey123 connect form", () => {
      const result = isSurvey123Connect({
        typeKeywords: ["Survey123 Connect"],
      } as restPortal.IItem);

      expect(result).toBeTruthy();
    });

    it("correctly indicates non-survey123 connect form", () => {
      const result = isSurvey123Connect({
        typeKeywords: [],
      } as any as restPortal.IItem);

      expect(result).toBeFalsy();
    });

    it("handles null input", () => {
      const result = isSurvey123Connect(null as any);

      expect(result).toBeFalsy();
    });
  });

  describe("setDisplayMapKeyword", () => {
    it("adds map keyword", () => {
      const result = setDisplayMapKeyword([], true);
      expect(result).toEqual([MAP_SURVEY_TYPEKEYWORD]);
    });

    it("removes map keyword", () => {
      const result = setDisplayMapKeyword([MAP_SURVEY_TYPEKEYWORD], false);
      expect(result).toEqual([]);
    });

    it("handles null input", () => {
      const result = setDisplayMapKeyword(null as any, false);
      expect(result).toEqual([]);
    });
  });

  describe("shouldDisplayMap", () => {
    it("returns true when type is form and typeKeywords includes MAP_SURVEY_KEYWORD", () => {
      const result = shouldDisplayMap({
        type: "Form",
        typeKeywords: [MAP_SURVEY_TYPEKEYWORD],
      } as restPortal.IItem);
      expect(result).toBeTruthy();
    });

    it("else returns false", () => {
      const result = shouldDisplayMap({
        type: "Form",
        typeKeywords: [],
      } as any as restPortal.IItem);
      expect(result).toBeFalsy();
    });
  });
});
