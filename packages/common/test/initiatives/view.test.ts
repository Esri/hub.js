import { cloneObject } from "../../src/util";
import {
  CONTEXT,
  INITIATIVE_ENTITY,
  INITIATIVE_HUB_SEARCH_RESULT,
} from "./fixtures";
import * as internalContentUtils from "../../src/content/_internal/internalContentUtils";
import * as titleUrlModule from "../../src/urls/getCardViewModelTitleUrl";
import {
  convertInitiativeEntityToCardViewModel,
  convertInitiativeSearchResultToCardViewModel,
} from "../../src/initiatives/view";

describe("initiative view module:", () => {
  let getShortenedCategoriesSpy: any;

  beforeEach(() => {
    getShortenedCategoriesSpy = spyOn(
      internalContentUtils,
      "getShortenedCategories"
    ).and.returnValue(["category1", "category2"]);
  });

  describe("convertInitiativeEntityToCardViewModel:", () => {
    let getCardViewModelTitleUrlFromEntitySpy: any;

    beforeEach(() => {
      getCardViewModelTitleUrlFromEntitySpy = spyOn(
        titleUrlModule,
        "getCardViewModelTitleUrlFromEntity"
      ).and.returnValue("https://mock-title-url.com");
    });

    it("returns the card view model from the intiative entity", () => {
      const result = convertInitiativeEntityToCardViewModel(
        INITIATIVE_ENTITY,
        CONTEXT
      );

      expect(getCardViewModelTitleUrlFromEntitySpy).toHaveBeenCalledTimes(1);
      expect(getCardViewModelTitleUrlFromEntitySpy).toHaveBeenCalledWith(
        INITIATIVE_ENTITY,
        CONTEXT,
        "self",
        ""
      );
      expect(getShortenedCategoriesSpy).toHaveBeenCalledTimes(1);
      expect(getShortenedCategoriesSpy).toHaveBeenCalledWith(
        INITIATIVE_ENTITY.categories
      );

      expect(result).toEqual({
        access: INITIATIVE_ENTITY.access,
        actionLinks: [],
        badges: [],
        id: INITIATIVE_ENTITY.id,
        family: "initiative",
        source: INITIATIVE_ENTITY.owner,
        summary: INITIATIVE_ENTITY.summary,
        title: INITIATIVE_ENTITY.name,
        titleUrl: "https://mock-title-url.com",
        thumbnailUrl: INITIATIVE_ENTITY.thumbnailUrl,
        type: INITIATIVE_ENTITY.type,
        additionalInfo: [
          { i18nKey: "type", value: INITIATIVE_ENTITY.type },
          {
            i18nKey: "dateUpdated",
            value: INITIATIVE_ENTITY.updatedDate.toLocaleDateString("en-US"),
          },
          { i18nKey: "tags", value: INITIATIVE_ENTITY.tags.join(", ") },
          { i18nKey: "categories", value: "category1, category2" },
          {
            i18nKey: "dateCreated",
            value: INITIATIVE_ENTITY.createdDate.toLocaleDateString("en-US"),
          },
        ],
      });
    });
    it("does not include tags/categories in the view model's additional info if none are defined", () => {
      const modifiedEntity = cloneObject(INITIATIVE_ENTITY);
      modifiedEntity.tags = [];
      modifiedEntity.categories = [];

      const result = convertInitiativeEntityToCardViewModel(
        modifiedEntity,
        CONTEXT
      );

      expect(result.additionalInfo?.length).toBe(3);
    });
  });

  describe("convertInitiativeSearchResultToCardViewModel", () => {
    let getCardViewModelTitleUrlFromSearchResultSpy: any;

    beforeEach(() => {
      getCardViewModelTitleUrlFromSearchResultSpy = spyOn(
        titleUrlModule,
        "getCardViewModelTitleUrlFromSearchResult"
      ).and.returnValue("https://mock-title-url.com");
    });

    it("returns the card view model from the hub search result", () => {
      const result = convertInitiativeSearchResultToCardViewModel(
        INITIATIVE_HUB_SEARCH_RESULT
      );

      expect(getCardViewModelTitleUrlFromSearchResultSpy).toHaveBeenCalledTimes(
        1
      );
      expect(getCardViewModelTitleUrlFromSearchResultSpy).toHaveBeenCalledWith(
        INITIATIVE_HUB_SEARCH_RESULT,
        "self",
        ""
      );

      expect(result).toEqual({
        access: INITIATIVE_HUB_SEARCH_RESULT.access,
        actionLinks: [],
        badges: [],
        id: INITIATIVE_HUB_SEARCH_RESULT.id,
        index: INITIATIVE_HUB_SEARCH_RESULT.index,
        family: "initiative",
        source: INITIATIVE_HUB_SEARCH_RESULT.owner,
        summary: INITIATIVE_HUB_SEARCH_RESULT.summary,
        title: INITIATIVE_HUB_SEARCH_RESULT.name,
        titleUrl: "https://mock-title-url.com",
        thumbnailUrl: INITIATIVE_HUB_SEARCH_RESULT.links?.thumbnail,
        type: INITIATIVE_HUB_SEARCH_RESULT.type,
        additionalInfo: [
          { i18nKey: "type", value: INITIATIVE_HUB_SEARCH_RESULT.type },
          {
            i18nKey: "dateUpdated",
            value:
              INITIATIVE_HUB_SEARCH_RESULT.updatedDate.toLocaleDateString(
                "en-US"
              ),
          },
          {
            i18nKey: "tags",
            value: INITIATIVE_HUB_SEARCH_RESULT.tags?.join(", ") as string,
          },
          { i18nKey: "categories", value: "category1, category2" },
          {
            i18nKey: "dateCreated",
            value:
              INITIATIVE_HUB_SEARCH_RESULT.createdDate.toLocaleDateString(
                "en-US"
              ),
          },
        ],
      });
    });
    it("does not include tags/categories in the view model's additional info if none are defined", () => {
      const modifiedSearchResult = cloneObject(INITIATIVE_HUB_SEARCH_RESULT);
      modifiedSearchResult.tags = undefined;
      modifiedSearchResult.categories = undefined;

      const result =
        convertInitiativeSearchResultToCardViewModel(modifiedSearchResult);

      expect(result.additionalInfo?.length).toBe(3);
    });
  });
});
