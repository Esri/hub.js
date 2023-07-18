import { HubEntity, IArcGISContext, IHubSearchResult } from "../../src";
import {
  getCardViewModelTitleUrlFromSearchResult,
  getCardViewModelTitleUrlFromEntity,
} from "../../src/urls/getCardViewModelTitleUrl";
import * as getItemHomeUrlModule from "../../src/urls/get-item-home-url";
import * as getRelativeWorkspaceUrlModule from "../../src/core/getRelativeWorkspaceUrl";
import * as internalContentUtils from "../../src/content/_internal/internalContentUtils";

const MOCK_SELF_URL = "https://mock-self-url.com";
const MOCK_SITE_RELATIVE_URL = "/mock-hub-relative-url";
const MOCK_WORKSPACE_RELATIVE_URL = "/mock-relative-workspace-url";

describe("getCardViewModelTitleUrlFromSearchResult", () => {
  let MOCK_SEARCH_RESULT: IHubSearchResult;

  beforeEach(() => {
    MOCK_SEARCH_RESULT = {
      type: "Hub Project",
      links: {
        self: MOCK_SELF_URL,
        siteRelative: MOCK_SITE_RELATIVE_URL,
        workspaceRelative: MOCK_WORKSPACE_RELATIVE_URL,
      },
    } as IHubSearchResult;
  });

  describe("default", () => {
    it('target = "self": returns the correct title url', () => {
      const result = getCardViewModelTitleUrlFromSearchResult(
        MOCK_SEARCH_RESULT,
        "self"
      );
      expect(result).toBe(MOCK_SELF_URL);
    });

    describe('target = "siteRelative', () => {
      it("baseUrl is undefined: returns the correct title url", () => {
        const result = getCardViewModelTitleUrlFromSearchResult(
          MOCK_SEARCH_RESULT,
          "siteRelative"
        );
        expect(result).toBe(MOCK_SITE_RELATIVE_URL);
      });
      it("baseUrl is defined: returns the correct title url", () => {
        const result = getCardViewModelTitleUrlFromSearchResult(
          MOCK_SEARCH_RESULT,
          "siteRelative",
          "https://mock-base"
        );
        expect(result).toBe(`https://mock-base${MOCK_SITE_RELATIVE_URL}`);
      });
    });

    describe('target = "workspaceRelative"', () => {
      it("baseUrl is undefined: returns the correct title url", () => {
        const result = getCardViewModelTitleUrlFromSearchResult(
          MOCK_SEARCH_RESULT,
          "workspaceRelative"
        );
        expect(result).toBe(MOCK_WORKSPACE_RELATIVE_URL);
      });
      it("baseUrl is defined: returns the correct title url", () => {
        const result = getCardViewModelTitleUrlFromSearchResult(
          MOCK_SEARCH_RESULT,
          "workspaceRelative",
          "https://mock-base"
        );
        expect(result).toBe(`https://mock-base${MOCK_WORKSPACE_RELATIVE_URL}`);
      });
    });

    it('target = "none": returns undefined', () => {
      const result = getCardViewModelTitleUrlFromSearchResult(
        MOCK_SEARCH_RESULT,
        "none"
      );
      expect(result).toBeUndefined();
    });
    it('target = "event": returns undefined', () => {
      const result = getCardViewModelTitleUrlFromSearchResult(
        MOCK_SEARCH_RESULT,
        "event"
      );
      expect(result).toBeUndefined();
    });

    describe("links are undefined", () => {
      beforeEach(() => {
        MOCK_SEARCH_RESULT.links = undefined;
      });

      it("baseUrl is undefined: returns undefined", () => {
        const result = getCardViewModelTitleUrlFromSearchResult(
          MOCK_SEARCH_RESULT,
          "self"
        );
        expect(result).toBeUndefined();
      });
      it("baseUrl is defined: returns the base url", () => {
        const result = getCardViewModelTitleUrlFromSearchResult(
          MOCK_SEARCH_RESULT,
          "siteRelative",
          "https://mock-base"
        );
        expect(result).toBe("https://mock-base");
      });
    });
  });

  describe('type = "Hub Site Application"', () => {
    beforeEach(() => {
      MOCK_SEARCH_RESULT.type = "Hub Site Application";
    });
    it('returns the site\'s "self" url', () => {
      const result = getCardViewModelTitleUrlFromSearchResult(
        MOCK_SEARCH_RESULT,
        "self"
      );
      expect(result).toBe(MOCK_SELF_URL);
    });
    it('target = "none": returns undefined', () => {
      const result = getCardViewModelTitleUrlFromSearchResult(
        MOCK_SEARCH_RESULT,
        "none"
      );
      expect(result).toBeUndefined();
    });
    it('target = "event": returns undefined', () => {
      const result = getCardViewModelTitleUrlFromSearchResult(
        MOCK_SEARCH_RESULT,
        "event"
      );
      expect(result).toBeUndefined();
    });
    it("links are undefined: returns undefined", () => {
      MOCK_SEARCH_RESULT.links = undefined;
      const result = getCardViewModelTitleUrlFromSearchResult(
        MOCK_SEARCH_RESULT,
        "self"
      );
      expect(result).toBeUndefined();
    });
  });
});

describe("getCardViewModelTitleUrlFromEntity", () => {
  let MOCK_ENTITY: HubEntity;
  let MOCK_CONTEXT: IArcGISContext;
  let getItemHomeUrlSpy: any;
  let getRelativeWorkspaceUrlSpy: any;
  let getHubRelativeUrlSpy: any;

  beforeEach(() => {
    MOCK_ENTITY = { id: "12300a", type: "Hub Project" } as HubEntity;
    MOCK_CONTEXT = {} as IArcGISContext;

    getItemHomeUrlSpy = spyOn(
      getItemHomeUrlModule,
      "getItemHomeUrl"
    ).and.returnValue(MOCK_SELF_URL);
    getRelativeWorkspaceUrlSpy = spyOn(
      getRelativeWorkspaceUrlModule,
      "getRelativeWorkspaceUrl"
    ).and.returnValue(MOCK_WORKSPACE_RELATIVE_URL);
    getHubRelativeUrlSpy = spyOn(
      internalContentUtils,
      "getHubRelativeUrl"
    ).and.returnValue(MOCK_SITE_RELATIVE_URL);
  });

  it('target = "self": returns the correct title url', () => {
    const result = getCardViewModelTitleUrlFromEntity(
      MOCK_ENTITY,
      MOCK_CONTEXT,
      "self"
    );
    expect(getItemHomeUrlSpy).toHaveBeenCalledTimes(1);
    expect(result).toBe(MOCK_SELF_URL);
  });
  describe('target = "siteRelative', () => {
    it("baseUrl is undefined: returns the correct title url", () => {
      const result = getCardViewModelTitleUrlFromEntity(
        MOCK_ENTITY,
        MOCK_CONTEXT,
        "siteRelative"
      );
      expect(getHubRelativeUrlSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe(MOCK_SITE_RELATIVE_URL);
    });
    it("baseUrl is defined: returns the correct title url", () => {
      const result = getCardViewModelTitleUrlFromEntity(
        MOCK_ENTITY,
        MOCK_CONTEXT,
        "siteRelative",
        "https://mock-base"
      );
      expect(getHubRelativeUrlSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe(`https://mock-base${MOCK_SITE_RELATIVE_URL}`);
    });
  });
  describe('target = "workspaceRelative"', () => {
    it("baseUrl is undefined: returns the correct title url", () => {
      const result = getCardViewModelTitleUrlFromEntity(
        MOCK_ENTITY,
        MOCK_CONTEXT,
        "workspaceRelative"
      );
      expect(getRelativeWorkspaceUrlSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe(MOCK_WORKSPACE_RELATIVE_URL);
    });
    it("baseUrl is defined: returns the correct title url", () => {
      const result = getCardViewModelTitleUrlFromEntity(
        MOCK_ENTITY,
        MOCK_CONTEXT,
        "workspaceRelative",
        "https://mock-base"
      );
      expect(getRelativeWorkspaceUrlSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe(`https://mock-base${MOCK_WORKSPACE_RELATIVE_URL}`);
    });
  });
  it('target = "none": returns undefined', () => {
    const result = getCardViewModelTitleUrlFromEntity(
      MOCK_ENTITY,
      MOCK_CONTEXT,
      "none"
    );
    expect(result).toBeUndefined();
  });
  it('target = "event": returns undefined', () => {
    const result = getCardViewModelTitleUrlFromEntity(
      MOCK_ENTITY,
      MOCK_CONTEXT,
      "event"
    );
    expect(result).toBeUndefined();
  });

  describe('type = "Hub Site Application"', () => {
    beforeEach(() => {
      MOCK_ENTITY.type = "Hub Site Application";
    });
    it('returns the site\'s "self" url', () => {
      const result = getCardViewModelTitleUrlFromEntity(
        MOCK_ENTITY,
        MOCK_CONTEXT,
        "self"
      );
      expect(result).toBe(MOCK_SELF_URL);
    });
    it('target = "none": returns undefined', () => {
      const result = getCardViewModelTitleUrlFromEntity(
        MOCK_ENTITY,
        MOCK_CONTEXT,
        "none"
      );
      expect(result).toBeUndefined();
    });
    it('target = "event": returns undefined', () => {
      const result = getCardViewModelTitleUrlFromEntity(
        MOCK_ENTITY,
        MOCK_CONTEXT,
        "event"
      );
      expect(result).toBeUndefined();
    });
  });
});
