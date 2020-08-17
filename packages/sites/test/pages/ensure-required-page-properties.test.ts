import { ensureRequiredPageProperties, PAGE_TYPE_KEYWORD } from "../../src";
import { IModelTemplate } from "@esri/hub-common";

describe("ensureRequiredPageProperties", () => {
  it("adds required props", async () => {
    const incomplete = ({
      item: {
        url: "should get squashed",
        typeKeywords: []
      },
      data: {}
    } as unknown) as IModelTemplate;

    const options = {
      isPortal: false,
      username: "tate"
    };

    const chk = ensureRequiredPageProperties(incomplete, options);

    expect(chk.data.values.updatedAt).toBeDefined();
    expect(chk.data.values.updatedBy).toBe("tate");
    expect(chk.data.values.sites).toEqual([]);

    expect(chk.item.type).toBe("Hub Page");
    expect(chk.item.url).toBe("");
    expect(chk.item.typeKeywords).toContain(PAGE_TYPE_KEYWORD);
    expect(chk.item.access).toBe("private");
    expect(chk.item.owner).toBe("tate");
  });

  it("happy path", async () => {
    const perfectModel = ({
      item: {
        url: "",
        typeKeywords: [PAGE_TYPE_KEYWORD]
      },
      data: {
        values: {
          sites: []
        }
      }
    } as unknown) as IModelTemplate;

    const options = {
      isPortal: false,
      username: "tate"
    };

    const chk = ensureRequiredPageProperties(perfectModel, options);

    expect(chk.data.values.updatedAt).toBeDefined();
    expect(chk.data.values.updatedBy).toBe("tate");
    expect(chk.data.values.sites).toEqual([]);

    expect(chk.item.type).toBe("Hub Page");
    expect(chk.item.access).toBe("private");
    expect(chk.item.owner).toBe("tate");
  });
});
