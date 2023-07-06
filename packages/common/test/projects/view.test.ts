import {
  getCardViewModelFromProjectEntity,
  getCardViewModelFromProjectSearchResult,
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

  describe("getCardViewModelFromProjectEntity:", () => {
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
      const result = getCardViewModelFromProjectEntity(
        PROJECT_ENTITY,
        CONTEXT,
        "ago",
        "en-US"
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
    it('target = "view": returns the correct title url', () => {
      const result = getCardViewModelFromProjectEntity(
        PROJECT_ENTITY,
        CONTEXT,
        "view",
        "en-US"
      );
      expect(result.titleUrl).toBe("/mock-hub-relative-url");
    });
    it('target = "workspace": returns the correct title url', () => {
      const result = getCardViewModelFromProjectEntity(
        PROJECT_ENTITY,
        CONTEXT,
        "workspace",
        "en-US"
      );
      expect(result.titleUrl).toBe("/mock-relative-workspace-url");
    });
  });

  describe("getCardViewModelFromProjectSearchResult", () => {
    it("returns the card view model from the hub search result", () => {
      const result = getCardViewModelFromProjectSearchResult(
        PROJECT_HUB_SEARCH_RESULT,
        "ago",
        "en-US"
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
    it('target = "view": returns the correct title url', () => {
      const result = getCardViewModelFromProjectSearchResult(
        PROJECT_HUB_SEARCH_RESULT,
        "view",
        "en-US"
      );
      expect(result.titleUrl).toBe("/mock-hub-relative-url");
    });
    it('target = "workspace": returns the correct title url', () => {
      const result = getCardViewModelFromProjectSearchResult(
        PROJECT_HUB_SEARCH_RESULT,
        "workspace",
        "en-US"
      );
      expect(result.titleUrl).toBe("/mock-relative-workspace-url");
    });
  });
});
