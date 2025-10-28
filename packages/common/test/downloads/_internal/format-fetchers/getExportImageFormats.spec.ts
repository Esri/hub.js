import {
  describe,
  it,
  expect,
} from "vitest";
import {
  IHubEditableContent,
  IServiceExtendedProps,
} from "../../../../src/core/types/IHubEditableContent";
import { EXPORT_IMAGE_FORMATS } from "../../../../src/downloads/_internal/_types";
import { getExportImageFormats } from "../../../../src/downloads/_internal/format-fetchers/getExportImageFormats";
import { ServiceDownloadFormat } from "../../../../src/downloads/enums/serviceDownloadFormat";

describe("getExportImageDownloadFormats", () => {
  it("should return an array of all image formats if the server version is 10.2+", () => {
    const entity = {
      extendedProps: {
        server: {
          currentVersion: 10.2,
        },
      } as IServiceExtendedProps,
    } as IHubEditableContent;

    const result = getExportImageFormats(entity);
    const formats = result.map(({ format }) => format);
    expect(formats).toEqual(EXPORT_IMAGE_FORMATS);
  });

  it("should exclude certain formats if the server version is below 10.2", () => {
    const entity = {
      extendedProps: {
        server: {
          currentVersion: 10.1,
        },
      } as IServiceExtendedProps,
    } as IHubEditableContent;

    const result = getExportImageFormats(entity);
    const formats = result.map(({ format }) => format);
    const expected = EXPORT_IMAGE_FORMATS.filter(
      (f) => f !== ServiceDownloadFormat.PNG32
    );
    expect(formats).toEqual(expected);
  });

  it("should exclude certain formats if the server version is not available", () => {
    const entity = {
      extendedProps: {
        server: {}, // no currentVersion
      } as IServiceExtendedProps,
    } as IHubEditableContent;

    const result = getExportImageFormats(entity);
    const formats = result.map(({ format }) => format);
    const expected = EXPORT_IMAGE_FORMATS.filter(
      (f) => f !== ServiceDownloadFormat.PNG32
    );
    expect(formats).toEqual(expected);
  });
});
