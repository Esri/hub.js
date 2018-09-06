/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  copyImageResources,
  getImageMimeTypeFromFileName,
  addImageAsResource
} from "../src/util";
import { MOCK_REQUEST_OPTIONS } from "./mocks/fake-session";
import * as fetchMock from "fetch-mock";
import { IRequestOptions } from "@esri/arcgis-rest-request";

describe("Initiative Utilities ::", () => {
  describe("get mime type for image ::", () => {
    it("should return the mimetype", () => {
      expect(getImageMimeTypeFromFileName("foo.png")).toBe("image/png");
      expect(getImageMimeTypeFromFileName("foo.gif")).toBe("image/gif");
      expect(getImageMimeTypeFromFileName("foo.jpg")).toBe("image/jpeg");
    });
  });
});
