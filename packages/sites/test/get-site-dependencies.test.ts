import { getSiteDependencies } from "../src";
import * as layoutModule from "../src/layout";
import { IModel } from "@esri/hub-common";

describe("getSiteDependencies", () => {
  it("gets dependencies", async () => {
    const layoutDeps = ["123", "456", "789"];

    const layoutSpy = spyOn(
      layoutModule,
      "getLayoutDependencies"
    ).and.returnValue(layoutDeps);

    const site = ({
      item: {},
      data: {
        values: {
          pages: [{ id: "page1" }, { id: "page2" }, { id: "page3" }],
          layout: {
            layout: true // this is just used to make sure it got passed into getLayoutDependencies
          }
        }
      }
    } as unknown) as IModel;

    const dependencies = getSiteDependencies(site);

    expect(dependencies).toEqual([
      "123",
      "456",
      "789",
      "page1",
      "page2",
      "page3"
    ]);
    expect(layoutSpy).toHaveBeenCalledWith({ layout: true });
  });

  it("doesnt blow up if something doesnt exist", () => {
    const layoutDeps: string[] = [];

    spyOn(layoutModule, "getLayoutDependencies").and.returnValue(layoutDeps);

    const site = ({
      item: {},
      data: {
        values: {}
      }
    } as unknown) as IModel;

    const dependencies = getSiteDependencies(site);

    expect(dependencies).toEqual([]);
  });
});
