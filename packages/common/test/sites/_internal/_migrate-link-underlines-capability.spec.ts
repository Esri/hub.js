import {
  describe,
  it,
  expect,
} from "vitest";
import { _migrateLinkUnderlinesCapability } from "../../../src/sites/_internal/_migrate-link-underlines-capability";

describe("_migrateLinkUnderlinesCapability", () => {
  it("removes underlinedLinks capability if it exists", () => {
    const model = {
      item: {},
      data: {
        values: {
          capabilities: ["foo", "underlinedLinks", "consentNotice", "bar"],
        },
      },
    };
    const result = _migrateLinkUnderlinesCapability(model);
    expect(result.data.values.capabilities as any).toEqual([
      "foo",
      "consentNotice",
      "bar",
    ]);
  });

  it("should not alter capabilities if underlinedLinks does not exist", () => {
    const model = {
      item: {},
      data: {
        values: {
          capabilities: ["foo", "consentNotice", "bar"],
        },
      },
    };
    const result = _migrateLinkUnderlinesCapability(model);
    expect(result.data.values.capabilities as any).toEqual([
      "foo",
      "consentNotice",
      "bar",
    ]);
  });

  it("should do nothing if capabilities do not exist", () => {
    const model = {
      item: {},
      data: {
        values: {},
      },
    };
    const result = _migrateLinkUnderlinesCapability(model);
    expect((result.data.values as any).capabilities).toBeUndefined();
  });
});
