/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { searchInitiatives, searchInitiativeTemplates } from "../src/search";
import * as ItemsApi from "@esri/arcgis-rest-portal";
import { MOCK_REQUEST_OPTIONS } from "./mocks/fake-session";
import { InitiativeSearchResults } from "./mocks/search-results";

describe("initiative search ::", () => {
  let itemSearchSpy: any;
  beforeEach(() => {
    itemSearchSpy = spyOn(ItemsApi, "searchItems").and.callFake((opts: any) => {
      return Promise.resolve(InitiativeSearchResults);
    });
  });
  describe("search initiatives ::", () => {
    it("should append the type", done => {
      const opts = {
        q: "water",
        ...MOCK_REQUEST_OPTIONS
      } as any;
      return searchInitiatives(opts).then(results => {
        // ensure the type was appended
        expect(itemSearchSpy.calls.count()).toBe(1);
        const args = itemSearchSpy.calls.argsFor(0);
        const searchOpts = args[0];
        expect(searchOpts.q).toBe("water AND type: Hub Initiative");
        done();
      });
    });
    it("should handle empty q", done => {
      const opts = {
        q: null,
        ...MOCK_REQUEST_OPTIONS
      } as any;
      return searchInitiatives(opts).then(results => {
        // ensure the type was appended
        expect(itemSearchSpy.calls.count()).toBe(1);
        const args = itemSearchSpy.calls.argsFor(0);
        const searchOpts = args[0];
        expect(searchOpts.q).toBe("type: Hub Initiative");
        done();
      });
    });
  });

  describe("search initiative templates ::", () => {
    it("should append the typekeyword", done => {
      const opts = {
        q: "water",
        ...MOCK_REQUEST_OPTIONS
      } as any;
      return searchInitiativeTemplates(opts).then(results => {
        // ensure the type was appended
        expect(itemSearchSpy.calls.count()).toBe(1);
        const args = itemSearchSpy.calls.argsFor(0);
        const searchOpts = args[0];
        expect(searchOpts.q).toBe(
          "water AND type: Hub Initiative AND typekeywords:hubInitiativeTemplate"
        );
        done();
      });
    });
    it("should handle null searches", done => {
      const opts = {
        q: null,
        ...MOCK_REQUEST_OPTIONS
      } as any;
      return searchInitiativeTemplates(opts).then(results => {
        // ensure the type was appended
        expect(itemSearchSpy.calls.count()).toBe(1);
        const args = itemSearchSpy.calls.argsFor(0);
        const searchOpts = args[0];
        expect(searchOpts.q).toBe(
          "type: Hub Initiative AND typekeywords:hubInitiativeTemplate"
        );
        done();
      });
    });
  });
});
