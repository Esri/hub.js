import { getThumbnailUiSchemaElement } from "../../src/core/schemas/internal/getThumbnailUiSchemaElement";
import {
  describe,
  it,
  afterEach,
  vi,
} from "vitest";

describe("getThumbnailUiSchemaElement", () => {
  const i18nScope = "entity";
  const thumbnail = "thumb.png";
  const thumbUrl = "http://example.com/thumb.png";
  const requestOptions = {} as any;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns group-specific options", () => {
    const el = getThumbnailUiSchemaElement(
      i18nScope,
      thumbnail,
      thumbUrl,
      "group",
      requestOptions
    );
    // simple checks without jest-specific matchers
    if (!Array.isArray(el)) throw new Error("expected array");
    const options = el[0].options as any;
    if (options.imgSrc !== thumbUrl) throw new Error("imgSrc mismatch");
    if (typeof options.defaultImgUrl !== "string")
      throw new Error("defaultImgUrl not string");
    if (options.aspectRatio !== 1) throw new Error("aspectRatio mismatch");
    if (el[0].labelKey !== `${i18nScope}.fields._thumbnail.label`)
      throw new Error("labelKey mismatch");
  });

  it("returns event-specific options", () => {
    const el = getThumbnailUiSchemaElement(
      i18nScope,
      thumbnail,
      thumbUrl,
      "event",
      requestOptions
    );
    if (!Array.isArray(el)) throw new Error("expected array");
    const options = el[0].options as any;
    if (options.imgSrc !== thumbUrl) throw new Error("imgSrc mismatch");
    if (typeof options.defaultImgUrl !== "string")
      throw new Error("defaultImgUrl not string");
    if (options.aspectRatio !== 1.5) throw new Error("aspectRatio mismatch");
    if (
      !Array.isArray(options.sources) ||
      options.sources.indexOf("url") === -1
    )
      throw new Error("sources mismatch");
    if (el[0].labelKey !== "shared.fields._thumbnail.label")
      throw new Error("labelKey mismatch");
  });

  it("returns default/content options", () => {
    const el = getThumbnailUiSchemaElement(
      i18nScope,
      thumbnail,
      thumbUrl,
      "content",
      requestOptions
    );
    if (!Array.isArray(el)) throw new Error("expected array");
    const options = el[0].options as any;
    if (options.imgSrc !== thumbUrl) throw new Error("imgSrc mismatch");
    if (typeof options.defaultImgUrl !== "string")
      throw new Error("defaultImgUrl not string");
    if (options.aspectRatio !== 1.5) throw new Error("aspectRatio mismatch");
    if (el[0].labelKey !== "shared.fields._thumbnail.label")
      throw new Error("labelKey mismatch");
  });
});
