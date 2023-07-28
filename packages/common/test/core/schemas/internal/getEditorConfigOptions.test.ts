import { getEditorConfigOptions } from "../../../../src/core/schemas/internal/getEditorConfigOptions";
import * as GetOptionsModule from "../../../../src/core/schemas/internal/getConfigOptions";
import { EditorType } from "../../../../src";

describe("getEditorConfigOptions:", () => {
  it("returns options based on entity type", async () => {
    const spy = spyOn(GetOptionsModule, "getConfigOptions").and.callFake(() => {
      return Promise.resolve({} as any);
    });

    await getEditorConfigOptions("hub:project:edit", {} as any, {} as any);
    expect(spy).toHaveBeenCalled();
    const opts = spy.calls.argsFor(0)[0];
    // verify opts
    expect(opts).toEqual([
      "access",
      "location",
      "tags",
      "categories",
      "thumbnail",
      "groupsToShareTo",
      "featuredImage",
      "featuredContentCatalogs",
    ]);
  });
  it("returns empty options for unknown entity type", async () => {
    const spy = spyOn(GetOptionsModule, "getConfigOptions").and.callFake(() => {
      return Promise.resolve({} as any);
    });

    await getEditorConfigOptions(
      "hub:WOOT:edit" as EditorType,
      {} as any,
      {} as any
    );
    expect(spy).toHaveBeenCalled();
    const opts = spy.calls.argsFor(0)[0];
    // verify opts
    expect(opts).toEqual([]);
  });
});
