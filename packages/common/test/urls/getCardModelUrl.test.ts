import { HubEntity, IArcGISContext, IHubSearchResult } from "../../src";
import {
  getCardModelUrlFromResult,
  getCardModelUrlFromEntity,
} from "../../src/urls/getCardModelUrl";

const MOCK_SELF_URL = "https://mock-self-url.com";
const MOCK_SITE_RELATIVE_URL = "/mock-hub-relative-url";
const MOCK_WORKSPACE_RELATIVE_URL = "/mock-relative-workspace-url";

describe("getCardModelUrlFromResult", () => {
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
      const result = getCardModelUrlFromResult(MOCK_SEARCH_RESULT, "self");
      expect(result).toBe(MOCK_SELF_URL);
    });

    describe('target = "siteRelative', () => {
      it("baseUrl is undefined: returns the correct title url", () => {
        const result = getCardModelUrlFromResult(
          MOCK_SEARCH_RESULT,
          "siteRelative"
        );
        expect(result).toBe(MOCK_SITE_RELATIVE_URL);
      });
      it("baseUrl is defined: returns the correct title url", () => {
        const result = getCardModelUrlFromResult(
          MOCK_SEARCH_RESULT,
          "siteRelative",
          "https://mock-base"
        );
        expect(result).toBe(`https://mock-base${MOCK_SITE_RELATIVE_URL}`);
      });
    });

    describe('target = "workspaceRelative"', () => {
      it("baseUrl is undefined: returns the correct title url", () => {
        const result = getCardModelUrlFromResult(
          MOCK_SEARCH_RESULT,
          "workspaceRelative"
        );
        expect(result).toBe(MOCK_WORKSPACE_RELATIVE_URL);
      });
      it("baseUrl is defined: returns the correct title url", () => {
        const result = getCardModelUrlFromResult(
          MOCK_SEARCH_RESULT,
          "workspaceRelative",
          "https://mock-base"
        );
        expect(result).toBe(`https://mock-base${MOCK_WORKSPACE_RELATIVE_URL}`);
      });
    });

    it('target = "none": returns undefined', () => {
      const result = getCardModelUrlFromResult(MOCK_SEARCH_RESULT, "none");
      expect(result).toBeUndefined();
    });
    it('target = "event": returns "#"', () => {
      const result = getCardModelUrlFromResult(MOCK_SEARCH_RESULT, "event");
      expect(result).toBe("#");
    });

    describe("links are undefined", () => {
      beforeEach(() => {
        MOCK_SEARCH_RESULT.links = undefined;
      });

      it("baseUrl is undefined: returns undefined", () => {
        const result = getCardModelUrlFromResult(MOCK_SEARCH_RESULT, "self");
        expect(result).toBeUndefined();
      });
      it("baseUrl is defined: returns the base url", () => {
        const result = getCardModelUrlFromResult(
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
      const result = getCardModelUrlFromResult(MOCK_SEARCH_RESULT, "self");
      expect(result).toBe(MOCK_SELF_URL);
    });
    it('target = "none": returns undefined', () => {
      const result = getCardModelUrlFromResult(MOCK_SEARCH_RESULT, "none");
      expect(result).toBeUndefined();
    });
    it('target = "event": returns "#"', () => {
      const result = getCardModelUrlFromResult(MOCK_SEARCH_RESULT, "event");
      expect(result).toBe("#");
    });
    it("links are undefined: returns undefined", () => {
      MOCK_SEARCH_RESULT.links = undefined;
      const result = getCardModelUrlFromResult(MOCK_SEARCH_RESULT, "self");
      expect(result).toBeUndefined();
    });
  });
});

describe("getCardModelUrlFromEntity", () => {
  let MOCK_ENTITY: HubEntity;
  let MOCK_CONTEXT: IArcGISContext;

  beforeEach(() => {
    MOCK_ENTITY = {
      id: "12300a",
      type: "Hub Project",
      links: {
        self: MOCK_SELF_URL,
        siteRelative: MOCK_SITE_RELATIVE_URL,
        workspaceRelative: MOCK_WORKSPACE_RELATIVE_URL,
      },
    } as HubEntity;
    MOCK_CONTEXT = {} as IArcGISContext;
  });

  it("handles undefined entity links", () => {
    MOCK_ENTITY.links = undefined;
    const selfResult = getCardModelUrlFromEntity(
      MOCK_ENTITY,
      MOCK_CONTEXT,
      "self"
    );
    const siteRelativeResult = getCardModelUrlFromEntity(
      MOCK_ENTITY,
      MOCK_CONTEXT,
      "siteRelative",
      "base-url"
    );
    const workspaceRelativeResult = getCardModelUrlFromEntity(
      MOCK_ENTITY,
      MOCK_CONTEXT,
      "workspaceRelative",
      "base-url"
    );

    expect(selfResult).toBeUndefined();
    expect(siteRelativeResult).toBe("base-url");
    expect(workspaceRelativeResult).toBe("base-url");
  });
  it('target = "self": returns the correct title url', () => {
    const result = getCardModelUrlFromEntity(MOCK_ENTITY, MOCK_CONTEXT, "self");
    expect(result).toBe(MOCK_SELF_URL);
  });
  describe('target = "siteRelative', () => {
    it("baseUrl is undefined: returns the correct title url", () => {
      const result = getCardModelUrlFromEntity(
        MOCK_ENTITY,
        MOCK_CONTEXT,
        "siteRelative"
      );
      expect(result).toBe(MOCK_SITE_RELATIVE_URL);
    });
    it("baseUrl is defined: returns the correct title url", () => {
      const result = getCardModelUrlFromEntity(
        MOCK_ENTITY,
        MOCK_CONTEXT,
        "siteRelative",
        "https://mock-base"
      );
      expect(result).toBe(`https://mock-base${MOCK_SITE_RELATIVE_URL}`);
    });
  });
  describe('target = "workspaceRelative"', () => {
    it("baseUrl is undefined: returns the correct title url", () => {
      const result = getCardModelUrlFromEntity(
        MOCK_ENTITY,
        MOCK_CONTEXT,
        "workspaceRelative"
      );
      expect(result).toBe(MOCK_WORKSPACE_RELATIVE_URL);
    });
    it("baseUrl is defined: returns the correct title url", () => {
      const result = getCardModelUrlFromEntity(
        MOCK_ENTITY,
        MOCK_CONTEXT,
        "workspaceRelative",
        "https://mock-base"
      );
      expect(result).toBe(`https://mock-base${MOCK_WORKSPACE_RELATIVE_URL}`);
    });
  });
  it('target = "none": returns undefined', () => {
    const result = getCardModelUrlFromEntity(MOCK_ENTITY, MOCK_CONTEXT, "none");
    expect(result).toBeUndefined();
  });
  it('target = "event": returns "#', () => {
    const result = getCardModelUrlFromEntity(
      MOCK_ENTITY,
      MOCK_CONTEXT,
      "event"
    );
    expect(result).toBe("#");
  });

  describe('type = "Hub Site Application"', () => {
    beforeEach(() => {
      MOCK_ENTITY.type = "Hub Site Application";
    });
    it("handles undefined entity links", () => {
      MOCK_ENTITY.links = undefined;
      const result = getCardModelUrlFromEntity(
        MOCK_ENTITY,
        MOCK_CONTEXT,
        "self"
      );
      expect(result).toBeUndefined();
    });
    it('always returns the site\'s "self" url', () => {
      const result = getCardModelUrlFromEntity(
        MOCK_ENTITY,
        MOCK_CONTEXT,
        "siteRelative"
      );
      expect(result).toBe(MOCK_SELF_URL);
    });
    it('target = "none": returns undefined', () => {
      const result = getCardModelUrlFromEntity(
        MOCK_ENTITY,
        MOCK_CONTEXT,
        "none"
      );
      expect(result).toBeUndefined();
    });
    it('target = "event": returns "#"', () => {
      const result = getCardModelUrlFromEntity(
        MOCK_ENTITY,
        MOCK_CONTEXT,
        "event"
      );
      expect(result).toBe("#");
    });
  });
});
