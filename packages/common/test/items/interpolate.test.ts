import * as adlibModule from "adlib";
import { interpolate } from "../../src";

describe("interpolate", function() {
  it("calls adlib", function() {
    spyOn(adlibModule, "adlib");

    const args = [{ id: "template" }, { id: "settings" }, { id: "transforms" }];

    interpolate(args[0], args[1], args[2]);

    expect(adlibModule.adlib).toHaveBeenCalledWith(...args);
  });
});
