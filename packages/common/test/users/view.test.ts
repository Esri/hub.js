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
      });
    });
    it("title and source fall back to expected default vals", () => {
      const modifiedSearchResult = cloneObject(USER_HUB_SEARCH_RESULT);
      modifiedSearchResult.name = undefined as any;

      const result = userResultToCardModel(modifiedSearchResult);

      expect(result.title).toBe(`@${USER_HUB_SEARCH_RESULT.owner}`);
      expect(result.source).toBeFalsy();
    });
    describe("membership badges", () => {
      it("adds an owner badge if the user is the group owner", () => {
        const GROUP_MEMBER_RESULT = cloneObject(USER_HUB_SEARCH_RESULT);
        GROUP_MEMBER_RESULT.isGroupOwner = true;
        GROUP_MEMBER_RESULT.memberType = "admin";

        const result = userResultToCardModel(GROUP_MEMBER_RESULT);

        expect(result.badges).toEqual([
          {
            icon: "user-key",
            color: "gray",
            i18nKey: "badges.members.owner",
            hideLabel: true,
            tooltip: { i18nKey: "badges.members.owner" },
          },
        ]);
      });
      it("adds an amin badge if the user is a group admin", () => {
        const GROUP_MEMBER_RESULT = cloneObject(USER_HUB_SEARCH_RESULT);
        GROUP_MEMBER_RESULT.memberType = "admin";

        const result = userResultToCardModel(GROUP_MEMBER_RESULT);

        expect(result.badges).toEqual([
          {
            icon: "user-up",
            color: "gray",
            i18nKey: "badges.members.admin",
            hideLabel: true,
            tooltip: { i18nKey: "badges.members.admin" },
          },
        ]);
      });
      it("adds a member badge if the user is a group member", () => {
        const GROUP_MEMBER_RESULT = cloneObject(USER_HUB_SEARCH_RESULT);
        GROUP_MEMBER_RESULT.memberType = "member";

        const result = userResultToCardModel(GROUP_MEMBER_RESULT);

        expect(result.badges).toEqual([
          {
            icon: "user",
            color: "gray",
            i18nKey: "badges.members.member",
            hideLabel: true,
            tooltip: { i18nKey: "badges.members.member" },
          },
        ]);
      });
    });
  });
});
