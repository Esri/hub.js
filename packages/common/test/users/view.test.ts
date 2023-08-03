import { cloneObject } from "../../src/util";
import { CONTEXT, USER_HUB_SEARCH_RESULT } from "./fixtures";
import * as internalContentUtils from "../../src/content/_internal/internalContentUtils";
import * as titleUrlModule from "../../src/urls/getCardModelUrl";
import { userResultToCardModel } from "../../src/users/view";

describe("user view module:", () => {
  let getShortenedCategoriesSpy: any;

  beforeEach(() => {
    getShortenedCategoriesSpy = spyOn(
      internalContentUtils,
      "getShortenedCategories"
    ).and.returnValue(["category1", "category2"]);
  });

  describe("userResultToCardModel", () => {
    let getCardModelUrlFromResultSpy: any;

    beforeEach(() => {
      getCardModelUrlFromResultSpy = spyOn(
        titleUrlModule,
        "getCardModelUrlFromResult"
      ).and.returnValue("https://mock-title-url.com");
    });

    it("returns the card view model from the hub search result", () => {
      const result = userResultToCardModel(USER_HUB_SEARCH_RESULT);

      expect(getCardModelUrlFromResultSpy).toHaveBeenCalledTimes(1);
      expect(getCardModelUrlFromResultSpy).toHaveBeenCalledWith(
        USER_HUB_SEARCH_RESULT,
        "self",
        ""
      );

      expect(result).toEqual({
        access: USER_HUB_SEARCH_RESULT.access,
        actionLinks: [],
        badges: [],
        id: USER_HUB_SEARCH_RESULT.id,
        index: USER_HUB_SEARCH_RESULT.index,
        family: "people",
        source: `@${USER_HUB_SEARCH_RESULT.owner}`,
        summary: USER_HUB_SEARCH_RESULT.summary,
        title: USER_HUB_SEARCH_RESULT.name,
        titleUrl: "https://mock-title-url.com",
        thumbnailUrl: USER_HUB_SEARCH_RESULT.links?.thumbnail,
        type: USER_HUB_SEARCH_RESULT.type,
        additionalInfo: [
          { i18nKey: "org", value: USER_HUB_SEARCH_RESULT.orgName },
          { i18nKey: "type", value: USER_HUB_SEARCH_RESULT.type },
          {
            i18nKey: "tags",
            value: USER_HUB_SEARCH_RESULT.tags?.join(", ") as string,
          },
          {
            i18nKey: "dateUpdated",
            value:
              USER_HUB_SEARCH_RESULT.updatedDate.toLocaleDateString("en-US"),
          },
        ],
      });
    });
    it("does not include tags/categories in the view model's additional info if none are defined", () => {
      const modifiedSearchResult = cloneObject(USER_HUB_SEARCH_RESULT);
      modifiedSearchResult.tags = undefined;
      modifiedSearchResult.categories = undefined;

      const result = userResultToCardModel(modifiedSearchResult);

      expect(result.additionalInfo?.length).toBe(3);
    });
    it("title and source fall back to expected default vals", () => {
      const modifiedSearchResult = cloneObject(USER_HUB_SEARCH_RESULT);
      modifiedSearchResult.name = undefined as any;

      const result = userResultToCardModel(modifiedSearchResult);

      expect(result.title).toBe(`@${USER_HUB_SEARCH_RESULT.owner}`);
      expect(result.source).toBeFalsy();
    });
  });
});
