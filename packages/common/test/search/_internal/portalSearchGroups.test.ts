import {
  cloneObject,
  IFilterGroup,
  IHubSearchOptions,
  IQuery,
} from "../../../src";
import {
  portalSearchGroups,
  portalSearchGroupsFilterGroups,
} from "../../../src/search/_internal/portalSearchGroups";

import * as Portal from "@esri/arcgis-rest-portal";
import * as SimpleResponse from "../../mocks/portal-groups-search/simple-response.json";
import { MOCK_AUTH, MOCK_ENTERPRISE_AUTH } from "../../mocks/mock-auth";

describe("portalSearchGroups module:", () => {
  describe("portalSearchGroupFilterGroups:", () => {
    it("defaults to ago prod", async () => {
      const searchGroupsSpy = spyOn(Portal, "searchGroups").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const f: IFilterGroup<"group"> = {
        operation: "AND",
        filterType: "group",
        filters: [
          {
            filterType: "group",
            term: "water",
          },
        ],
      };
      const o: IHubSearchOptions = {};
      await portalSearchGroupsFilterGroups([f], o);
      expect(searchGroupsSpy.calls.count()).toBe(1, "should call searchGroups");
      const [expectedParams] = searchGroupsSpy.calls.argsFor(0);
      expect(expectedParams.q).toEqual("water");
      expect(expectedParams.portal).toBe("https://www.arcgis.com/sharing/rest");
      expect(expectedParams.requestOptions).toBeDefined();
    });
    it("can search enterprise", async () => {
      const searchGroupsSpy = spyOn(Portal, "searchGroups").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const f: IFilterGroup<"group"> = {
        operation: "AND",
        filterType: "group",
        filters: [
          {
            filterType: "group",
            term: "water",
          },
        ],
      };
      const o: IHubSearchOptions = {
        authentication: MOCK_ENTERPRISE_AUTH,
      };
      await portalSearchGroupsFilterGroups([f], o);
      expect(searchGroupsSpy.calls.count()).toBe(1, "should call searchGroups");
      const [expectedParams] = searchGroupsSpy.calls.argsFor(0);
      expect(expectedParams.q).toEqual("water");
      expect(expectedParams.authentication).toBe(MOCK_ENTERPRISE_AUTH);
      expect(expectedParams.portal).toBeUndefined();
      expect(expectedParams.requestOptions).toBeDefined();
      expect(expectedParams.requestOptions.portal).toBe(
        MOCK_ENTERPRISE_AUTH.portal
      );
      expect(expectedParams.requestOptions.authentication).toBe(
        MOCK_ENTERPRISE_AUTH
      );
    });
    it("uses requestOptions.portal if passed", async () => {
      const searchGroupsSpy = spyOn(Portal, "searchGroups").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const f: IFilterGroup<"group"> = {
        operation: "AND",
        filterType: "group",
        filters: [
          {
            filterType: "group",
            term: "water",
          },
        ],
      };
      const o: IHubSearchOptions = {
        requestOptions: {
          portal: "https://some-server.com/gis/sharing/rest",
        },
      };
      await portalSearchGroupsFilterGroups([f], o);
      expect(searchGroupsSpy.calls.count()).toBe(1, "should call searchGroups");
      const [expectedParams] = searchGroupsSpy.calls.argsFor(0);
      expect(expectedParams.q).toEqual("water");
      expect(expectedParams.portal).toBe(
        "https://some-server.com/gis/sharing/rest"
      );
      expect(expectedParams.requestOptions.portal).toBe(
        "https://some-server.com/gis/sharing/rest"
      );
    });
    it("defaults to api url if other portal props are not available", async () => {
      const searchGroupsSpy = spyOn(Portal, "searchGroups").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const f: IFilterGroup<"group"> = {
        operation: "AND",
        filterType: "group",
        filters: [
          {
            filterType: "group",
            term: "water",
          },
        ],
      };
      const o: IHubSearchOptions = {
        requestOptions: {},
      };
      await portalSearchGroupsFilterGroups([f], o);
      expect(searchGroupsSpy.calls.count()).toBe(1, "should call searchGroups");
      const [expectedParams] = searchGroupsSpy.calls.argsFor(0);
      expect(expectedParams.q).toEqual("water");
      expect(expectedParams.portal).toBe("https://www.arcgis.com/sharing/rest");
    });
  });
  describe("portalSearchGroups", () => {
    it("searches ago", async () => {
      const searchGroupsSpy = spyOn(Portal, "searchGroups").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const qry: IQuery = {
        targetEntity: "group",
        filters: [
          {
            predicates: [
              {
                term: "water",
              },
            ],
          },
        ],
      };

      const o: IHubSearchOptions = {
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
        },
      };
      await portalSearchGroups(qry, o);
      expect(searchGroupsSpy.calls.count()).toBe(1, "should call searchGroups");
      const [expectedParams] = searchGroupsSpy.calls.argsFor(0);
      expect(expectedParams.q).toEqual("water");
      expect(expectedParams.portal).toBe("https://www.arcgis.com/sharing/rest");
      expect(expectedParams.requestOptions).toBeDefined();
    });
    it("can search enterprise", async () => {
      const searchGroupsSpy = spyOn(Portal, "searchGroups").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const qry: IQuery = {
        targetEntity: "group",
        filters: [
          {
            predicates: [
              {
                term: "water",
              },
            ],
          },
        ],
      };
      const o: IHubSearchOptions = {
        requestOptions: {
          authentication: MOCK_ENTERPRISE_AUTH,
          portal: MOCK_ENTERPRISE_AUTH.portal,
        },
      };
      await portalSearchGroups(qry, o);
      expect(searchGroupsSpy.calls.count()).toBe(1, "should call searchGroups");
      const [expectedParams] = searchGroupsSpy.calls.argsFor(0);
      expect(expectedParams.q).toEqual("water");
      expect(expectedParams.authentication).toBe(MOCK_ENTERPRISE_AUTH);
      expect(expectedParams.portal).toBeUndefined();
      expect(expectedParams.requestOptions).toBeDefined();
      expect(expectedParams.requestOptions.portal).toBe(
        MOCK_ENTERPRISE_AUTH.portal
      );
      expect(expectedParams.requestOptions.authentication).toBe(
        MOCK_ENTERPRISE_AUTH
      );
    });
    it("uses requestOptions.portal if passed", async () => {
      const searchGroupsSpy = spyOn(Portal, "searchGroups").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const qry: IQuery = {
        targetEntity: "group",
        filters: [
          {
            predicates: [
              {
                term: "water",
              },
            ],
          },
        ],
      };
      const o: IHubSearchOptions = {
        requestOptions: {
          portal: "https://some-server.com/gis/sharing/rest",
        },
      };
      await portalSearchGroups(qry, o);
      expect(searchGroupsSpy.calls.count()).toBe(1, "should call searchGroups");
      const [expectedParams] = searchGroupsSpy.calls.argsFor(0);
      expect(expectedParams.q).toEqual("water");
      expect(expectedParams.portal).toBe(
        "https://some-server.com/gis/sharing/rest"
      );
      expect(expectedParams.requestOptions.portal).toBe(
        "https://some-server.com/gis/sharing/rest"
      );
    });
    it("throws if requestOptions not defined", async () => {
      // const searchGroupsSpy = spyOn(Portal, "searchGroups").and.callFake(() => {
      //   return Promise.resolve(cloneObject(SimpleResponse));
      // });
      const qry: IQuery = {
        targetEntity: "group",
        filters: [
          {
            predicates: [
              {
                term: "water",
              },
            ],
          },
        ],
      };

      try {
        await portalSearchGroups(qry, {});
      } catch (err) {
        expect(err.name).toBe("HubError");
        expect(err.message).toBe("options.requestOptions is required.");
      }
    });
  });
});
