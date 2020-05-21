import { removeSiteFromPage } from "../../src";
import { IModel } from "@esri/hub-common";

describe("removeSiteFromPage", () => {
  it("removes site from page sites array", async () => {
    const page = ({
      data: {
        values: {
          sites: [{ id: "foo" }, { id: "bar" }, { id: "baz" }]
        }
      }
    } as unknown) as IModel;

    const newSites = removeSiteFromPage("baz", page);

    expect(newSites).toEqual(
      [{ id: "foo" }, { id: "bar" }],
      "removed correct site"
    );
  });
});
