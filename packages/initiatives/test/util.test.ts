/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  copyImageResources,
  copyEmbeddedImageResources,
  addImageAsResource,
} from "../src/util";
import { MOCK_REQUEST_OPTIONS } from "./mocks/fake-session";
import * as fetchMock from "fetch-mock";
const REST_URL = "https://www.arcgis.com/sharing/rest";

describe("Initiative Utilities ::", () => {
  describe("addImageAsResource :: ", () => {
    // -----------------------------------------------------------------------
    // NOTE
    // blob responses are difficult to make cross platform we will just have
    // to trust the isomorphic fetch will do its job
    // -----------------------------------------------------------------------
    afterEach(() => {
      fetchMock.restore();
    });
    it("should GET the image from the url and POST it to the item", (done) => {
      if (typeof Blob === "undefined") {
        // we are in node, so just skip this
        expect(true).toBeTruthy();
        done();
      } else {
        const fakeResponse = {
          body: new Blob(),
          sendAsJson: false,
        };
        // mock two fetch calls...
        // first is a GET that should return a blob...
        fetchMock.get(
          `${REST_URL}/content/items/3ef/resources/fake-image.png`,
          fakeResponse
        );

        // second is a POST that will contain a blob and return json
        fetchMock.post(
          `${REST_URL}/content/users/jeffvader/items/bz7/addResources`,
          { success: true }
        );

        return addImageAsResource(
          "bz7",
          "jeffvader",
          "main-image.png",
          `${REST_URL}/content/items/3ef/resources/fake-image.png`,
          MOCK_REQUEST_OPTIONS
        ).then((resp) => {
          expect(resp as boolean).toBeTruthy();
          // check that the mocks were called
          expect(fetchMock.done()).toBeTruthy();
          // inspect the POST call...
          const [url, options] = fetchMock.lastCall(
            `${REST_URL}/content/users/jeffvader/items/bz7/addResources`
          );
          expect(url).toBe(
            `${REST_URL}/content/users/jeffvader/items/bz7/addResources`
          );
          expect(options.method).toBe("POST");
          expect(options.body instanceof FormData).toBeTruthy();
          done();
        });
      }
    });
  });
  describe("copyImageResources ::", () => {
    // -----------------------------------------------------------------------
    // NOTE
    // blob responses are difficult to make cross platform we will just have
    // to trust the isomorphic fetch will do its job
    // -----------------------------------------------------------------------
    afterEach(() => {
      fetchMock.restore();
    });

    it("should make multiple calls to addImageAsResource", (done) => {
      if (typeof Blob === "undefined") {
        // we are in node, so just skip this
        expect(true).toBeTruthy();
        done();
      } else {
        const fakeResponse = {
          body: new Blob(),
          sendAsJson: false,
        };
        // mock two fetch calls...
        // first is a GET that should return a blob...
        fetchMock.get(
          `${REST_URL}/content/items/3ef/resources/one.png?token=fake-token`,
          fakeResponse
        );
        fetchMock.get(
          `${REST_URL}/content/items/3ef/resources/two.jpg?token=fake-token`,
          fakeResponse
        );

        // second is a POST that will contain a blob and return json
        fetchMock.post(
          `${REST_URL}/content/users/wadewatts/items/bz7/addResources`,
          { success: true }
        );
        // we are in a browser, so we can actually run this...
        return copyImageResources(
          "3ef",
          "bz7",
          "wadewatts",
          ["one.png", "two.jpg"],
          MOCK_REQUEST_OPTIONS
        ).then((resp) => {
          expect(resp).toBeTruthy();
          // check that the mocks were called
          expect(fetchMock.done()).toBeTruthy();
          const [url, options] = fetchMock.lastCall(
            `${REST_URL}/content/users/wadewatts/items/bz7/addResources`
          );
          expect(url).toBe(
            `${REST_URL}/content/users/wadewatts/items/bz7/addResources`
          );
          expect(options.method).toBe("POST");
          expect(options.body instanceof FormData).toBeTruthy();
          done();
        });
      }
    });
  });
  describe("copyEmbeddedImageResources ::", () => {
    // -----------------------------------------------------------------------
    // NOTE
    // blob responses are difficult to make cross platform we will just have
    // to trust the isomorphic fetch will do its job
    // -----------------------------------------------------------------------
    afterEach(() => {
      fetchMock.restore();
    });

    it("should make multiple calls to addImageAsResource", (done) => {
      if (typeof Blob === "undefined") {
        // we are in node, so just skip this
        expect(true).toBeTruthy();
        done();
      } else {
        const fakeResponse = {
          body: new Blob(),
          sendAsJson: false,
        };
        // mock two fetch calls...
        // first is a GET that should return a blob...
        fetchMock.get("foo.com", fakeResponse);
        fetchMock.get("bar.com", fakeResponse);

        // second is a POST that will contain a blob and return json
        fetchMock.post(`${REST_URL}/content/users/bz7/items/3ef/addResources`, {
          success: true,
        });
        const assets = [
          {
            name: "foo",
            url: "foo.com",
          },
          {
            name: "bar",
            url: "bar.com",
          },
        ];
        // we are in a browser, so we can actually run this...
        return copyEmbeddedImageResources(
          "3ef",
          "bz7",
          assets,
          MOCK_REQUEST_OPTIONS
        ).then((resp) => {
          expect(resp).toBeTruthy();
          // check that the mocks were called
          expect(fetchMock.done()).toBeTruthy();
          const [url, options] = fetchMock.lastCall(
            `${REST_URL}/content/users/bz7/items/3ef/addResources`
          );
          expect(url).toBe(
            `${REST_URL}/content/users/bz7/items/3ef/addResources`
          );
          expect(options.method).toBe("POST");
          expect(options.body instanceof FormData).toBeTruthy();
          done();
        });
      }
    });
    it("should fail silently", (done) => {
      if (typeof Blob === "undefined") {
        // we are in node, so just skip this
        expect(true).toBeTruthy();
        done();
      } else {
        // mock two fetch calls...
        // first is a GET that should return a blob...
        fetchMock.get("foo.com", {
          body: new Blob(),
          sendAsJson: false,
        });
        // second is a POST that will contain a blob and return json
        fetchMock.post(`${REST_URL}/content/users/bz7/items/3ef/addResources`, {
          success: false,
          code: 403,
        });
        const assets = [
          {
            name: "foo",
            url: "foo.com",
          },
        ];
        // we are in a browser, so we can actually run this...
        return copyEmbeddedImageResources(
          "3ef",
          "bz7",
          assets,
          MOCK_REQUEST_OPTIONS
        ).then((resp) => {
          expect(resp).toBeTruthy();
          done();
        });
      }
    });
  });
});
