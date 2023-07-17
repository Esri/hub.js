import {
  cloneObject,
  convertInitiativeEntityToCardViewModel,
  convertInitiativeSearchResultToCardViewModel,
} from "../../src";
import {
  CONTEXT,
  INITIATIVE_ENTITY,
  INITIATIVE_HUB_SEARCH_RESULT,
} from "./fixtures";
import * as getItemHomeUrlModule from "../../src/urls/get-item-home-url";
import * as internalContentUtils from "../../src/content/_internal/internalContentUtils";
import * as getRelativeWorkspaceUrlModule from "../../src/core/getRelativeWorkspaceUrl";

describe("initiative view module:", () => {
  let getShortenedCategoriesSpy: any;

  beforeEach(() => {
    getShortenedCategoriesSpy = spyOn(
      internalContentUtils,
      "getShortenedCategories"
    ).and.returnValue(["category1", "category2"]);
  });

  describe("convertInitiativeEntityToCardViewModel:", () => {
    let getItemHomeUrlSpy: any;
    let getRelativeWorkspaceUrlSpy: any;
    let getHubRelativeUrlSpy: any;

    beforeEach(() => {
      getItemHomeUrlSpy = spyOn(
        getItemHomeUrlModule,
        "getItemHomeUrl"
      ).and.returnValue("https://mock-home-url.com");
      getRelativeWorkspaceUrlSpy = spyOn(
        getRelativeWorkspaceUrlModule,
        "getRelativeWorkspaceUrl"
      ).and.returnValue("/mock-relative-workspace-url");
      getHubRelativeUrlSpy = spyOn(
        internalContentUtils,
        "getHubRelativeUrl"
      ).and.returnValue("/mock-hub-relative-url");
    });

    it("returns the card view model from the intiative entity", () => {
      const result = convertInitiativeEntityToCardViewModel(
        INITIATIVE_ENTITY,
        CONTEXT
      );

      expect(getItemHomeUrlSpy).toHaveBeenCalledTimes(1);
      expect(getItemHomeUrlSpy).toHaveBeenCalledWith(
        INITIATIVE_ENTITY.id,
        CONTEXT.hubRequestOptions
      );
      expect(getHubRelativeUrlSpy).toHaveBeenCalledTimes(1);
      expect(getHubRelativeUrlSpy).toHaveBeenCalledWith(
        INITIATIVE_ENTITY.type,
        INITIATIVE_ENTITY.id
      );
      expect(getRelativeWorkspaceUrlSpy).toHaveBeenCalledTimes(1);
      expect(getRelativeWorkspaceUrlSpy).toHaveBeenCalledWith(
        INITIATIVE_ENTITY.type,
        INITIATIVE_ENTITY.id
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
        titleUrl: "https://mock-home-url.com",
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
    it('target = "view": returns the correct title url', () => {
      const result = convertInitiativeEntityToCardViewModel(
        INITIATIVE_ENTITY,
        CONTEXT,
        "view"
      );
      expect(result.titleUrl).toBe("/mock-hub-relative-url");
    });
    it('target = "workspace": returns the correct title url', () => {
      const result = convertInitiativeEntityToCardViewModel(
        INITIATIVE_ENTITY,
        CONTEXT,
        "workspace"
      );
      expect(result.titleUrl).toBe("/mock-relative-workspace-url");
    });
  });

  describe("convertInitiativeSearchResultToCardViewModel", () => {
    it("returns the card view model from the hub search result", () => {
      const result = convertInitiativeSearchResultToCardViewModel(
        INITIATIVE_HUB_SEARCH_RESULT
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
        titleUrl: "https://mock-home-url.com",
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
      const modifiedSearchResult = cloneObject(INITIATIVE_HUB_SEARCH_RESULT);
      modifiedSearchResult.tags = undefined;
      modifiedSearchResult.categories = undefined;

      const result =
        convertInitiativeSearchResultToCardViewModel(modifiedSearchResult);

      expect(result.additionalInfo?.length).toBe(3);
    });
    it('target = "view": returns the correct title url', () => {
      const result = convertInitiativeSearchResultToCardViewModel(
        INITIATIVE_HUB_SEARCH_RESULT,
        "view"
      );
      expect(result.titleUrl).toBe("/mock-hub-relative-url");
    });
    it('target = "workspace": returns the correct title url', () => {
      const result = convertInitiativeSearchResultToCardViewModel(
        INITIATIVE_HUB_SEARCH_RESULT,
        "workspace"
      );
      expect(result.titleUrl).toBe("/mock-relative-workspace-url");
    });
  });
});
