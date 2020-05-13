import { unlinkPagesFromSite } from "../src";
import * as unlinkSiteAndPageModule from "../src/unlink-site-and-page";
import { IModel, IHubRequestOptions } from "@esri/hub-common";

describe("unlinkPagesFromSite", () => {
  it("unlinks pages from site", async () => {
    const model = ({
      data: {
        values: {
          pages: [{ id: "foo" }, { id: "bar" }]
        }
      }
    } as unknown) as IModel;

    const ro = {
      authentication: {
        token: "token"
      }
    } as IHubRequestOptions;

    const spy = spyOn(
      unlinkSiteAndPageModule,
      "unlinkSiteAndPage"
    ).and.returnValue(Promise.resolve({}));

    await unlinkPagesFromSite(model, ro);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.calls.argsFor(0)[0].pageId).toBe("foo");
    expect(spy.calls.argsFor(1)[0].pageId).toBe("bar");
  });
});
