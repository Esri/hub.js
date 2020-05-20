import { _updatePages } from "../src";
import * as fetchMock from "fetch-mock";
import { MOCK_HUB_REQOPTS } from "./test-helpers.test";
import { IModelTemplate } from "@esri/hub-common";

describe("_updatePages", () => {
  it("updates Page items", async () => {
    fetchMock
      .post(`glob:*/ef1/update*`, {
        status: 200,
        body: JSON.stringify({ success: true, id: "3ef" })
      })
      .post(`glob:*/ef2/update*`, {
        status: 200,
        body: JSON.stringify({ success: true, id: "3ef" })
      });

    const site = ({
      item: {
        id: "bc3",
        type: "Hub Site Application"
      },
      key: "bleep-boop",
      data: {}
    } as unknown) as IModelTemplate;
    const models = ([
      {
        item: { id: "ef1", type: "Hub Page" },
        data: { values: { sites: [] } }
      },
      {
        item: { id: "ef2", type: "Hub Page" },
        data: { values: { sites: [{ id: "other", title: "other" }] } }
      }
    ] as unknown) as IModelTemplate[];

    const results = await _updatePages(site, models, MOCK_HUB_REQOPTS);

    expect(results.length).toBe(2, "should return two promises");
    expect(fetchMock.called()).toBeTruthy("fetch should be intercepted");
  });
  it("_updatePages returns not promises if no Page", async () => {
    const site = ({
      item: {
        id: "bc3",
        type: "Hub Site Application"
      },
      key: "bleep-boop",
      data: {}
    } as unknown) as IModelTemplate;
    const models = ([
      { item: { id: "ef1", type: "Web Map" }, data: { values: { sites: [] } } },
      {
        item: { id: "ef2", type: "Web Map" },
        data: { values: { sites: [{ id: "other", title: "other" }] } }
      }
    ] as unknown) as IModelTemplate[];

    const results = await _updatePages(site, models, MOCK_HUB_REQOPTS);

    expect(results.length).toBe(0, "should return no promises");
  });
});
