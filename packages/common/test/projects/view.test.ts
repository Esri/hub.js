import { cloneObject } from "../../src/util";
import { CONTEXT, PROJECT_ENTITY, PROJECT_HUB_SEARCH_RESULT } from "./fixtures";
import * as internalContentUtils from "../../src/content/_internal/internalContentUtils";
import * as titleUrlModule from "../../src/urls/getCardViewModelTitleUrl";
import {
  convertProjectEntityToCardViewModel,
  convertProjectSearchResultToCardViewModel,
} from "../../src/projects/view";

describe("project view module:", () => {
  let getShortenedCategoriesSpy: any;

  beforeEach(() => {
    getShortenedCategoriesSpy = spyOn(
      internalContentUtils,
      "getShortenedCategories"
    ).and.returnValue(["category1", "category2"]);
  });

  describe("convertProjectEntityToCardViewModel:", () => {
    let getCardViewModelTitleUrlFromEntitySpy: any;

    beforeEach(() => {
      getCardViewModelTitleUrlFromEntitySpy = spyOn(
        titleUrlModule,
        "getCardViewModelTitleUrlFromEntity"
      ).and.returnValue("https://mock-title-url.com");
    });

    it("returns the card view model from the project entity", () => {
      const result = convertProjectEntityToCardViewModel(
        PROJECT_ENTITY,
        CONTEXT
      );

      expect(getCardViewModelTitleUrlFromEntitySpy).toHaveBeenCalledTimes(1);
      expect(getCardViewModelTitleUrlFromEntitySpy).toHaveBeenCalledWith(
        PROJECT_ENTITY,
        CONTEXT,
        "self",
        ""
      );
      expect(getShortenedCategoriesSpy).toHaveBeenCalledTimes(1);
      expect(getShortenedCategoriesSpy).toHaveBeenCalledWith(
        PROJECT_ENTITY.categories
      );

      expect(result).toEqual({
        access: PROJECT_ENTITY.access,
        actionLinks: [],
        badges: [],
        id: PROJECT_ENTITY.id,
        family: "project",
        source: PROJECT_ENTITY.owner,
        summary: PROJECT_ENTITY.summary,
        title: PROJECT_ENTITY.name,
        titleUrl: "https://mock-title-url.com",
        thumbnailUrl: PROJECT_ENTITY.thumbnailUrl,
        type: PROJECT_ENTITY.type,
        additionalInfo: [
          { i18nKey: "type", value: PROJECT_ENTITY.type },
          {
            i18nKey: "dateUpdated",
            value: PROJECT_ENTITY.updatedDate.toLocaleDateString("en-US"),
          },
          { i18nKey: "tags", value: PROJECT_ENTITY.tags.join(", ") },
          { i18nKey: "categories", value: "category1, category2" },
          {
            i18nKey: "dateCreated",
            value: PROJECT_ENTITY.createdDate.toLocaleDateString("en-US"),
          },
        ],
      });
    });
    it("does not include tags/categories in the view model's additional info if none are defined", () => {
      const modifiedEntity = cloneObject(PROJECT_ENTITY);
      modifiedEntity.tags = [];
      modifiedEntity.categories = [];

      const result = convertProjectEntityToCardViewModel(
        modifiedEntity,
        CONTEXT
      );

      expect(result.additionalInfo?.length).toBe(3);
    });
  });

  describe("convertProjectSearchResultToCardViewModel", () => {
    let getCardViewModelTitleUrlFromSearchResultSpy: any;

    beforeEach(() => {
      getCardViewModelTitleUrlFromSearchResultSpy = spyOn(
        titleUrlModule,
        "getCardViewModelTitleUrlFromSearchResult"
      ).and.returnValue("https://mock-title-url.com");
    });

    it("returns the card view model from the hub search result", () => {
      const result = convertProjectSearchResultToCardViewModel(
        PROJECT_HUB_SEARCH_RESULT
      );

      expect(getCardViewModelTitleUrlFromSearchResultSpy).toHaveBeenCalledTimes(
        1
      );
      expect(getCardViewModelTitleUrlFromSearchResultSpy).toHaveBeenCalledWith(
        PROJECT_HUB_SEARCH_RESULT,
        "self",
        ""
      );

      expect(result).toEqual({
        access: PROJECT_HUB_SEARCH_RESULT.access,
        actionLinks: [],
        badges: [],
        id: PROJECT_HUB_SEARCH_RESULT.id,
        family: "project",
        source: PROJECT_HUB_SEARCH_RESULT.owner,
        summary: PROJECT_HUB_SEARCH_RESULT.summary,
        title: PROJECT_HUB_SEARCH_RESULT.name,
        titleUrl: "https://mock-title-url.com",
        thumbnailUrl: PROJECT_HUB_SEARCH_RESULT.links?.thumbnail,
        type: PROJECT_HUB_SEARCH_RESULT.type,
        additionalInfo: [
          { i18nKey: "type", value: PROJECT_HUB_SEARCH_RESULT.type },
          {
            i18nKey: "dateUpdated",
            value:
              PROJECT_HUB_SEARCH_RESULT.updatedDate.toLocaleDateString("en-US"),
          },
          {
            i18nKey: "tags",
            value: PROJECT_HUB_SEARCH_RESULT.tags?.join(", ") as string,
          },
          { i18nKey: "categories", value: "category1, category2" },
          {
            i18nKey: "dateCreated",
            value:
              PROJECT_HUB_SEARCH_RESULT.createdDate.toLocaleDateString("en-US"),
          },
        ],
      });
    });
    it("does not include tags/categories in the view model's additional info if none are defined", () => {
      const modifiedSearchResult = cloneObject(PROJECT_HUB_SEARCH_RESULT);
      modifiedSearchResult.tags = undefined;
      modifiedSearchResult.categories = undefined;

      const result =
        convertProjectSearchResultToCardViewModel(modifiedSearchResult);

      expect(result.additionalInfo?.length).toBe(3);
    });
  });
});
