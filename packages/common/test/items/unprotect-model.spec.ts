vi.mock(
  "@esri/arcgis-rest-portal",
  async (importOriginal) =>
    ({
      ...(await importOriginal()),
      unprotectItem: vi.fn(),
    } as any)
);

import * as portal from "@esri/arcgis-rest-portal";
import { mockUserSession } from "../test-helpers/fake-user-session";
import { unprotectModel } from "../../src/items/unprotect-model";
import { IModel } from "../../src/hub-types";

afterEach(() => vi.restoreAllMocks());

describe("unprotectModel", () => {
  it("handles protected and unprotected items", async () => {
    vi.spyOn(portal as any, "unprotectItem").mockResolvedValue({
      success: true,
    });

    const model: IModel = {
      item: {
        id: "someId",
        protected: false,
        owner: "owner",
        created: 123,
        modified: 123,
        tags: [],
        numViews: 3,
        size: 3,
        title: "title",
        type: "Hub Site Application",
      },
      data: { foo: "bar", baz: { boop: "beep" } },
    };

    const result = await unprotectModel(model, {
      authentication: mockUserSession,
    });
    expect(result.success).toBeTruthy();
    // unprotect should not be called for already unprotected
    expect((portal as any).unprotectItem).toHaveBeenCalledTimes(0);

    (portal as any).unprotectItem.mockClear();
    model.item.protected = true;
    const result2 = await unprotectModel(model, {
      authentication: mockUserSession,
    });
    expect(result2.success).toBeTruthy();
    expect((portal as any).unprotectItem).toHaveBeenCalledTimes(1);
  });
});
// make ESM namespace spyable
vi.mock("@esri/arcgis-rest-portal", async (importOriginal: any) => {
  const mod = await importOriginal();
  return Object.assign({}, mod, {
    unprotectItem: vi.fn(),
  });
});

import * as portal from "@esri/arcgis-rest-portal";
import { mockUserSession } from "../test-helpers/fake-user-session";
import { unprotectModel } from "../../src/items/unprotect-model";
import { IModel } from "../../src/hub-types";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("unprotectModel", function () {
  afterEach(() => vi.restoreAllMocks());

  it("", async function () {
    const unprotectItemSpy = vi
      .spyOn(portal as any, "unprotectItem")
      .mockResolvedValue({ success: true });

    const model: IModel = {
      item: {
        id: "someId",
        protected: false,
        owner: "owner",
        created: 123,
        modified: 123,
        tags: [],
        numViews: 3,
        size: 3,
        title: "title",
        type: "Hub Site Application",
      },
      data: { foo: "bar", baz: { boop: "beep" } },
    } as any;

    const result = await unprotectModel(model, {
      authentication: mockUserSession,
    } as any);
    expect((result as any).success).toBeTruthy();
    expect(unprotectItemSpy).toHaveBeenCalledTimes(0);

    unprotectItemSpy.mockClear();

    model.item.protected = true;
    const result2 = await unprotectModel(model, {
      authentication: mockUserSession,
    } as any);
    expect((result2 as any).success).toBeTruthy();
    expect(unprotectItemSpy).toHaveBeenCalledTimes(1);
  });
});
