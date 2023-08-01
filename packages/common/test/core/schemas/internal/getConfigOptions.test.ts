import { IArcGISContext } from "../../../../src";
import * as ConfigOptionsHelpersModule from "../../../../src/core/schemas/internal/configOptionHelpers";
import { getConfigOptions } from "../../../../src/core/schemas/internal/getConfigOptions";

// This is really just testing delegation to the configHelper functions
describe("getConfigOptions:", () => {
  let AccessSpy: jasmine.Spy;
  let LocationSpy: jasmine.Spy;

  beforeEach(() => {
    // just set up a few spies to make sure the right functions are called
    AccessSpy = spyOn(
      ConfigOptionsHelpersModule.configHelpers,
      "access"
    ).and.callFake(() => {
      return Promise.resolve({} as any);
    });
    LocationSpy = spyOn(
      ConfigOptionsHelpersModule.configHelpers,
      "location"
    ).and.callFake(() => {
      return Promise.resolve({} as any);
    });
  });
  it("calls helpers", async () => {
    const ctx: IArcGISContext = {} as IArcGISContext;
    const entity = { fake: "entity" };
    const chk = await getConfigOptions(["access", "location"], entity, ctx);
    expect(AccessSpy).toHaveBeenCalledWith(entity, ctx);
    expect(LocationSpy).toHaveBeenCalledWith(entity, ctx);
  });
});
