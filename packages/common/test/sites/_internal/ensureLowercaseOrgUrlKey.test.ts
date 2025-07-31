import { ensureLowercaseOrgUrlKey } from "../../../src/sites/_internal/ensureLowercaseOrgUrlKey";
import { IModel } from "../../../src/hub-types";
import { cloneObject } from "../../../src";

describe("ensureLowercaseOrgUrlKey", () => {
  it("should lowercase orgUrlKey", () => {
    const model: IModel = {
      item: {
        properties: {
          slug: "essiso1|essiso1|essiso1|essiso1|essiso1|essiso1|testsite3",
          orgUrlKey: "ESSIso1",
        },
        typeKeywords: [],
      },
    } as IModel;
    const result = ensureLowercaseOrgUrlKey(model);
    expect(result.item.properties.orgUrlKey).toBe("essiso1");
  });

  it("does nothing if no orgUrlKey or slug is present", () => {
    const model: IModel = {
      item: {
        properties: {
          other: "value",
        },
        typeKeywords: [],
      },
    } as IModel;
    const result = ensureLowercaseOrgUrlKey(model);
    expect(result.item).toEqual(model.item);
  });

  it("should fix slug to only have one orgUrlKey prefix and lowercase", () => {
    const model: IModel = {
      item: {
        properties: {
          slug: "essiso1|essiso1|essiso1|essiso1|essiso1|essiso1|my-site",
          orgUrlKey: "ESSIso1",
        },
        typeKeywords: [],
      },
    } as IModel;
    const result = ensureLowercaseOrgUrlKey(model);
    expect(result.item.properties.slug).toBe("essiso1|my-site");
  });

  it("should update typeKeywords with new slug", () => {
    const model: IModel = {
      item: {
        properties: {
          slug: "ESSIso1|my-site",
          orgUrlKey: "ESSIso1",
        },
        typeKeywords: ["slug|ESSIso1|my-site", "other|keyword"],
      },
    } as IModel;
    const result = ensureLowercaseOrgUrlKey(model);
    expect(result.item.typeKeywords).toContain("slug|essiso1|my-site");
    expect(result.item.typeKeywords).not.toContain("slug|ESSIso1|my-site");
    expect(result.item.typeKeywords).toContain("other|keyword");
  });

  it("should leave other orgUrlKeys in the slug", () => {
    const model: IModel = {
      item: {
        properties: {
          slug: "ESSIso1|my-site",
          orgUrlKey: "ESSIso1",
        },
        typeKeywords: ["slug|ESSIso1|my-site", "other|keyword"],
      },
    } as IModel;
    const result = ensureLowercaseOrgUrlKey(model);
    expect(result.item.typeKeywords).toContain("slug|essiso1|my-site");
    expect(result.item.typeKeywords).not.toContain("slug|ESSIso1|my-site");
    expect(result.item.typeKeywords).toContain("other|keyword");
  });

  it("should add slug keyword if not present", () => {
    const model: IModel = {
      item: {
        properties: {
          slug: "ESSIso1|my-site",
          orgUrlKey: "ESSIso1",
        },
        typeKeywords: ["other|keyword"],
      },
    } as IModel;
    const result = ensureLowercaseOrgUrlKey(model);
    expect(result.item.typeKeywords).toContain("slug|essiso1|my-site");
    expect(result.item.typeKeywords).toContain("other|keyword");
  });

  it("should not mutate the original model", () => {
    const model: IModel = {
      item: {
        properties: {
          slug: "ESSIso1|my-site",
          orgUrlKey: "ESSIso1",
        },
        typeKeywords: ["other|keyword"],
      },
    } as IModel;
    const original = cloneObject(model);
    ensureLowercaseOrgUrlKey(model);
    expect(model).toEqual(original);
  });
});
