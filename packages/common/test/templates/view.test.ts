import { cloneObject } from "../../src/util";
import {
  initContextManager,
  TEMPLATE_ENTITY,
  TEMPLATE_HUB_SEARCH_RESULT,
} from "./fixtures";
import {
  templateToCardModel,
  templateResultToCardModel,
} from "../../src/templates/view";
import * as internalContentUtils from "../../src/content/_internal/internalContentUtils";
import * as titleUrlModule from "../../src/urls/getCardModelUrl";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";

describe("template view module:", () => {
  let getShortenedCategoriesSpy: any;
  let authdCtxMgr: ArcGISContextManager;

  beforeEach(async () => {
    authdCtxMgr = await initContextManager();
    getShortenedCategoriesSpy = spyOn(
      internalContentUtils,
      "getShortenedCategories"
    ).and.returnValue(["category1", "category2"]);
  });

  describe("templateToCardModel:", () => {
    let getCardModelUrlFromEntitySpy: any;

    beforeEach(() => {
      getCardModelUrlFromEntitySpy = spyOn(
        titleUrlModule,
        "getCardModelUrlFromEntity"
      ).and.returnValue("https://mock-title-url.com");
    });

    it("returns the card view model from the template entity", () => {
      const result = templateToCardModel(TEMPLATE_ENTITY, authdCtxMgr.context);

      expect(getCardModelUrlFromEntitySpy).toHaveBeenCalledTimes(1);
      expect(getCardModelUrlFromEntitySpy).toHaveBeenCalledWith(
        TEMPLATE_ENTITY,
        authdCtxMgr.context,
        "self",
        ""
      );
      expect(getShortenedCategoriesSpy).toHaveBeenCalledTimes(1);
      expect(getShortenedCategoriesSpy).toHaveBeenCalledWith(
        TEMPLATE_ENTITY.categories
      );

      expect(result).toEqual({
        access: TEMPLATE_ENTITY.access,
        actionLinks: [],
        badges: [],
        id: TEMPLATE_ENTITY.id,
        family: "template",
        source: TEMPLATE_ENTITY.owner,
        summary: TEMPLATE_ENTITY.summary,
        title: TEMPLATE_ENTITY.name,
        titleUrl: "https://mock-title-url.com",
        thumbnailUrl: TEMPLATE_ENTITY.thumbnailUrl,
        type: TEMPLATE_ENTITY.type,
        additionalInfo: [
          { i18nKey: "type", value: TEMPLATE_ENTITY.type },
          {
            i18nKey: "dateUpdated",
            value: TEMPLATE_ENTITY.updatedDate.toLocaleDateString("en-US"),
          },
          { i18nKey: "tags", value: TEMPLATE_ENTITY.tags.join(", ") },
          { i18nKey: "categories", value: "category1, category2" },
          {
            i18nKey: "dateCreated",
            value: TEMPLATE_ENTITY.createdDate.toLocaleDateString("en-US"),
          },
        ],
      });
    });
    it("does not include tags/categories in the view model's additional info if none are defined", () => {
      const modifiedEntity = cloneObject(TEMPLATE_ENTITY);
      modifiedEntity.tags = [];
      modifiedEntity.categories = [];

      const result = templateToCardModel(modifiedEntity, authdCtxMgr.context);

      expect(result.additionalInfo?.length).toBe(3);
    });
  });

  describe("templateResultToCardModel", () => {
    let getCardModelUrlFromResultSpy: any;

    beforeEach(() => {
      getCardModelUrlFromResultSpy = spyOn(
        titleUrlModule,
        "getCardModelUrlFromResult"
      ).and.returnValue("https://mock-title-url.com");
    });

    it("returns the card view model from the hub search result", () => {
      const result = templateResultToCardModel(TEMPLATE_HUB_SEARCH_RESULT);

      expect(getCardModelUrlFromResultSpy).toHaveBeenCalledTimes(1);
      expect(getCardModelUrlFromResultSpy).toHaveBeenCalledWith(
        TEMPLATE_HUB_SEARCH_RESULT,
        "self",
        ""
      );

      expect(result).toEqual({
        access: TEMPLATE_HUB_SEARCH_RESULT.access,
        actionLinks: [],
        badges: [],
        id: TEMPLATE_HUB_SEARCH_RESULT.id,
        index: TEMPLATE_HUB_SEARCH_RESULT.index,
        family: "template",
        source: TEMPLATE_HUB_SEARCH_RESULT.owner,
        summary: TEMPLATE_HUB_SEARCH_RESULT.summary,
        title: TEMPLATE_HUB_SEARCH_RESULT.name,
        titleUrl: "https://mock-title-url.com",
        thumbnailUrl: TEMPLATE_HUB_SEARCH_RESULT.links?.thumbnail,
        type: TEMPLATE_HUB_SEARCH_RESULT.type,
        additionalInfo: [
          { i18nKey: "type", value: TEMPLATE_HUB_SEARCH_RESULT.type },
          {
            i18nKey: "dateUpdated",
            value:
              TEMPLATE_HUB_SEARCH_RESULT.updatedDate.toLocaleDateString(
                "en-US"
              ),
          },
          {
            i18nKey: "tags",
            value: TEMPLATE_HUB_SEARCH_RESULT.tags?.join(", ") as string,
          },
          { i18nKey: "categories", value: "category1, category2" },
          {
            i18nKey: "dateCreated",
            value:
              TEMPLATE_HUB_SEARCH_RESULT.createdDate.toLocaleDateString(
                "en-US"
              ),
          },
        ],
      });
    });
    it("does not include tags/categories in the view model's additional info if none are defined", () => {
      const modifiedSearchResult = cloneObject(TEMPLATE_HUB_SEARCH_RESULT);
      modifiedSearchResult.tags = undefined;
      modifiedSearchResult.categories = undefined;

      const result = templateResultToCardModel(modifiedSearchResult);

      expect(result.additionalInfo?.length).toBe(3);
    });
  });
});
