import { IModel } from "../../../src/hub-types";
import { buildDraft } from "../../../src/sites/drafts/build-draft";

describe("buildDraft", () => {
  it("builds a draft", async () => {
    const model = {
      item: {
        id: "123",
        title: "my-title",
      },
      data: {
        values: {
          layout: {
            my: {
              rows: "true",
            },
          },
          defaultUrl: "www.foobar.com",
        },
      },
    } as unknown as IModel;

    const allowList = ["item.title", "data.values.layout"];

    expect(buildDraft(model, allowList)).toEqual({
      item: {
        title: "my-title",
      },
      data: {
        values: {
          layout: {
            my: {
              rows: "true",
            },
          },
        },
      },
    });
  });
});
