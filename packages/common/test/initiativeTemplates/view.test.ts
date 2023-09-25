import * as titleUrlModule from "../../src/urls/getCardModelUrl";
import * as internalContentUtils from "../../src/content/_internal/internalContentUtils";
import {
  INITIATIVE_TEMPLATE_ENTITY,
  CONTEXT,
  INITIATIVE_TEMPLATE_HUB_SEARCH_RESULT,
} from "./fixtures";
import {
  initiativeTemplateToCardModel,
  initiativeTemplateResultToCardModel,
} from "../../src/initiativeTemplates/view";
import { cloneObject } from "../../src";

describe("initiative template view module:", () => {
  let getShortenedCategoriesSpy: any;

  beforeEach(() => {
    getShortenedCategoriesSpy = spyOn(
      internalContentUtils,
      "getShortenedCategories"
    ).and.returnValue(["category1", "category2"]);
  });

  describe("initiativeTemplateToCardModel:", () => {
    let getCardModelUrlFromEntitySpy: any;

    beforeEach(() => {
      getCardModelUrlFromEntitySpy = spyOn(
        titleUrlModule,
        "getCardModelUrlFromEntity"
      ).and.returnValue("https://mock-title-url.com");
    });

    it("returns the card view model from the initiative template entity", () => {
      const result = initiativeTemplateToCardModel(
        INITIATIVE_TEMPLATE_ENTITY,
        CONTEXT
      );

      expect(getCardModelUrlFromEntitySpy).toHaveBeenCalledTimes(1);
      expect(getCardModelUrlFromEntitySpy).toHaveBeenCalledWith(
        INITIATIVE_TEMPLATE_ENTITY,
        CONTEXT,
        "self",
        ""
      );
      expect(getShortenedCategoriesSpy).toHaveBeenCalledTimes(1);
      expect(getShortenedCategoriesSpy).toHaveBeenCalledWith(
        INITIATIVE_TEMPLATE_ENTITY.categories
      );
      expect(result).toEqual({
        access: INITIATIVE_TEMPLATE_ENTITY.access,
        actionLinks: [],
        badges: [],
        id: INITIATIVE_TEMPLATE_ENTITY.id,
        family: "template",
        source: INITIATIVE_TEMPLATE_ENTITY.owner,
        summary: INITIATIVE_TEMPLATE_ENTITY.summary,
        title: INITIATIVE_TEMPLATE_ENTITY.name,
        titleUrl: "https://mock-title-url.com",
        thumbnailUrl: INITIATIVE_TEMPLATE_ENTITY.thumbnailUrl,
        type: INITIATIVE_TEMPLATE_ENTITY.type,
        additionalInfo: [
          {
            i18nKey: "type",
            value: INITIATIVE_TEMPLATE_ENTITY.type,
          },
          {
            i18nKey: "dateUpdated",
            value:
              INITIATIVE_TEMPLATE_ENTITY.updatedDate.toLocaleDateString(
                "en-US"
              ),
          },
          {
            i18nKey: "tags",
            value: INITIATIVE_TEMPLATE_ENTITY.tags.join(", "),
          },
          {
            i18nKey: "categories",
            value: "category1, category2",
          },
          {
            i18nKey: "dateCreated",
            value:
              INITIATIVE_TEMPLATE_ENTITY.createdDate.toLocaleDateString(
                "en-US"
              ),
          },
        ],
      });
    });

    it("does not include tags/categories in the view model's additional info if none are defined", () => {
      const modifiedEntity = cloneObject(INITIATIVE_TEMPLATE_ENTITY);
      modifiedEntity.tags = [];
      modifiedEntity.categories = [];

      const result = initiativeTemplateToCardModel(modifiedEntity, CONTEXT);

      expect(result.additionalInfo?.length).toBe(3);
    });
  });

  describe("initiativeTemplateResultToCardModel: ", () => {
    let getCardModelUrlFromResultSpy: any;

    beforeEach(() => {
      getCardModelUrlFromResultSpy = spyOn(
        titleUrlModule,
        "getCardModelUrlFromResult"
      ).and.returnValue("https://mock-title-url.com");
    });

    it("returns the card view model from the hub search result", () => {
      const result = initiativeTemplateResultToCardModel(
        INITIATIVE_TEMPLATE_HUB_SEARCH_RESULT
      );

      expect(getCardModelUrlFromResultSpy).toHaveBeenCalledTimes(1);
      expect(getCardModelUrlFromResultSpy).toHaveBeenCalledWith(
        INITIATIVE_TEMPLATE_HUB_SEARCH_RESULT,
        "self",
        ""
      );

      expect(result).toEqual({
        access: INITIATIVE_TEMPLATE_HUB_SEARCH_RESULT.access,
        actionLinks: [],
        badges: [],
        id: INITIATIVE_TEMPLATE_HUB_SEARCH_RESULT.id,
        index: INITIATIVE_TEMPLATE_HUB_SEARCH_RESULT.index,
        family: "template",
        source: INITIATIVE_TEMPLATE_HUB_SEARCH_RESULT.owner,
        summary: INITIATIVE_TEMPLATE_HUB_SEARCH_RESULT.summary,
        title: INITIATIVE_TEMPLATE_HUB_SEARCH_RESULT.name,
        titleUrl: "https://mock-title-url.com",
        thumbnailUrl: INITIATIVE_TEMPLATE_HUB_SEARCH_RESULT.links?.thumbnail,
        type: INITIATIVE_TEMPLATE_HUB_SEARCH_RESULT.type,
        additionalInfo: [
          {
            i18nKey: "type",
            value: INITIATIVE_TEMPLATE_HUB_SEARCH_RESULT.type,
          },
          {
            i18nKey: "dateUpdated",
            value:
              INITIATIVE_TEMPLATE_HUB_SEARCH_RESULT.updatedDate.toLocaleDateString(
                "en-US"
              ),
          },
          {
            i18nKey: "tags",
            value: INITIATIVE_TEMPLATE_HUB_SEARCH_RESULT.tags?.join(
              ", "
            ) as string,
          },
          { i18nKey: "categories", value: "category1, category2" },
          {
            i18nKey: "dateCreated",
            value:
              INITIATIVE_TEMPLATE_HUB_SEARCH_RESULT.createdDate.toLocaleDateString(
                "en-US"
              ),
          },
        ],
      });
    });

    it("does not include tags/categories in the view model's additional info if none are defined", () => {
      const modifiedSearchResult = cloneObject(
        INITIATIVE_TEMPLATE_HUB_SEARCH_RESULT
      );
      modifiedSearchResult.tags = undefined;
      modifiedSearchResult.categories = undefined;

      const result = initiativeTemplateResultToCardModel(modifiedSearchResult);

      expect(result.additionalInfo?.length).toBe(3);
    });
  });
});
