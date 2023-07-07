import {
  cloneObject,
  convertProjectEntityToCardViewModel,
  convertProjectSearchResultToCardViewModel,
} from "../../src";
import { CONTEXT, PROJECT_ENTITY, PROJECT_HUB_SEARCH_RESULT } from "./fixtures";
import * as getItemHomeUrlModule from "../../src/urls/get-item-home-url";
import * as internalContentUtils from "../../src/content/_internal/internalContentUtils";
import * as getRelativeWorkspaceUrlModule from "../../src/core/getRelativeWorkspaceUrl";

describe("project view module:", () => {
  let getShortenedCategoriesSpy: any;

  beforeEach(() => {
    getShortenedCategoriesSpy = spyOn(
      internalContentUtils,
      "getShortenedCategories"
    ).and.returnValue(["category1", "category2"]);
  });

  describe("convertProjectEntityToCardViewModel:", () => {
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

    it("returns the card view model from the project entity", () => {
      const result = convertProjectEntityToCardViewModel(
        PROJECT_ENTITY,
        CONTEXT
      );

      expect(getItemHomeUrlSpy).toHaveBeenCalledTimes(1);
      expect(getItemHomeUrlSpy).toHaveBeenCalledWith(
        PROJECT_ENTITY.id,
        CONTEXT.hubRequestOptions
      );
      expect(getHubRelativeUrlSpy).toHaveBeenCalledTimes(1);
      expect(getHubRelativeUrlSpy).toHaveBeenCalledWith(
        PROJECT_ENTITY.type,
        PROJECT_ENTITY.id
      );
      expect(getRelativeWorkspaceUrlSpy).toHaveBeenCalledTimes(1);
      expect(getRelativeWorkspaceUrlSpy).toHaveBeenCalledWith(
        PROJECT_ENTITY.type,
        PROJECT_ENTITY.id
      );
      expect(getShortenedCategoriesSpy).toHaveBeenCalledTimes(1);
      expect(getShortenedCategoriesSpy).toHaveBeenCalledWith(
        PROJECT_ENTITY.categories
      );

      expect(result).toEqual({
        access: PROJECT_ENTITY.access,
        badges: [],
        id: PROJECT_ENTITY.id,
        family: "project",
        source: PROJECT_ENTITY.owner,
        summary: PROJECT_ENTITY.summary,
        title: PROJECT_ENTITY.name,
        titleUrl: "https://mock-home-url.com",
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
    it('target = "view": returns the correct title url', () => {
      const result = convertProjectEntityToCardViewModel(
        PROJECT_ENTITY,
        CONTEXT,
        "view"
      );
      expect(result.titleUrl).toBe("/mock-hub-relative-url");
    });
    it('target = "workspace": returns the correct title url', () => {
      const result = convertProjectEntityToCardViewModel(
        PROJECT_ENTITY,
        CONTEXT,
        "workspace"
      );
      expect(result.titleUrl).toBe("/mock-relative-workspace-url");
    });
  });

  describe("convertProjectSearchResultToCardViewModel", () => {
    it("returns the card view model from the hub search result", () => {
      const result = convertProjectSearchResultToCardViewModel(
        PROJECT_HUB_SEARCH_RESULT
      );

      expect(result).toEqual({
        access: PROJECT_ENTITY.access,
        badges: [],
        id: PROJECT_ENTITY.id,
        family: "project",
        source: PROJECT_ENTITY.owner,
        summary: PROJECT_ENTITY.summary,
        title: PROJECT_ENTITY.name,
        titleUrl: "https://mock-home-url.com",
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
      const modifiedSearchResult = cloneObject(PROJECT_HUB_SEARCH_RESULT);
      modifiedSearchResult.tags = undefined;
      modifiedSearchResult.categories = undefined;

      const result =
        convertProjectSearchResultToCardViewModel(modifiedSearchResult);

      expect(result.additionalInfo?.length).toBe(3);
    });
    it('target = "view": returns the correct title url', () => {
      const result = convertProjectSearchResultToCardViewModel(
        PROJECT_HUB_SEARCH_RESULT,
        "view"
      );
      expect(result.titleUrl).toBe("/mock-hub-relative-url");
    });
    it('target = "workspace": returns the correct title url', () => {
      const result = convertProjectSearchResultToCardViewModel(
        PROJECT_HUB_SEARCH_RESULT,
        "workspace"
      );
      expect(result.titleUrl).toBe("/mock-relative-workspace-url");
    });
  });
});
