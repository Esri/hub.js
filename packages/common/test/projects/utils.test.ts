import { IModel } from "../../src";
import {
  createSlug,
  setSlugKeyword,
  mapObjectToModel,
  IPropertyMap,
  mapModelToObject,
  PropertyMapper,
} from "../../src/projects/utils";

describe("project utils:", () => {
  describe("createSlug:", () => {
    it("combined org and dasherized title", () => {
      expect(createSlug("Hello World", "DCdev")).toBe("dcdev-hello-world");
    });
  });
  describe("setSlugKeyword:", () => {
    it("removes existing slug keyword, add new one", () => {
      const chk = setSlugKeyword(["slug|old-slug"], "hello-world");
      expect(chk.length).toBe(1);
      expect(chk[0]).toBe("slug|hello-world");
    });
    it("adds slug entry", () => {
      const chk = setSlugKeyword(["otherKeyword"], "hello-world");
      expect(chk.length).toBe(2);
      expect(chk[1]).toBe("slug|hello-world");
    });
  });
  describe("mapObjectToModel:", () => {
    const obj = {
      color: "red",
    };
    const model = {
      item: { id: "3ef", properties: { other: "prop" } },
      data: {},
    } as unknown as IModel;
    it("maps deep properties into model", () => {
      const mappings: IPropertyMap[] = [
        {
          objectKey: "color",
          modelKey: "item.properties.color",
        },
      ];
      const chk = mapObjectToModel(obj, model, mappings);
      expect(chk.item.properties.color).toBe("red");
      expect(chk.item.properties.other).toBe("prop");
    });
    it("skips missing props", () => {
      const mappings: IPropertyMap[] = [
        {
          objectKey: "color",
          modelKey: "item.properties.color",
        },
        {
          objectKey: "missing",
          modelKey: "item.properties.missing",
        },
      ];
      const chk = mapObjectToModel(obj, model, mappings);
      expect(chk.item.properties.color).toBe("red");
      expect(chk.item.properties.other).toBe("prop");
      expect(chk.item.properties.missing).toBeUndefined();
    });
  });
  describe("mapModelToObject:", () => {
    const obj = {} as any;
    const model = {
      item: { id: "3ef", properties: { other: "prop", color: "blue" } },
      data: {},
    } as unknown as IModel;
    it("maps deep properties into object", () => {
      const mappings: IPropertyMap[] = [
        {
          objectKey: "color",
          modelKey: "item.properties.color",
        },
      ];
      const chk = mapModelToObject(model, obj, mappings);
      expect(chk.color).toBe("blue");
    });
    it("skips missing props", () => {
      const mappings: IPropertyMap[] = [
        {
          objectKey: "color",
          modelKey: "item.properties.color",
        },
        {
          objectKey: "missing",
          modelKey: "item.properties.missing",
        },
      ];
      const chk = mapModelToObject(model, obj, mappings);
      expect(chk.color).toBe("blue");
      expect(chk.missing).toBeUndefined();
    });
  });
  describe("PropertyMapper", () => {
    let pm: PropertyMapper<any>;
    const obj = {
      size: "large",
    } as any;
    const model = {
      item: { id: "3ef", properties: { other: "prop", color: "blue" } },
      data: {},
    } as unknown as IModel;
    beforeEach(() => {
      const mappings: IPropertyMap[] = [
        {
          objectKey: "color",
          modelKey: "item.properties.color",
        },
        {
          objectKey: "size",
          modelKey: "item.properties.size",
        },
      ];
      pm = new PropertyMapper(mappings);
    });
    it("maps model to object", () => {
      const chk = pm.modelToObject(model, obj);
      expect(chk.color).toBe("blue");
    });
    it("maps object to model", () => {
      const chk = pm.objectToModel(obj, model);
      expect(chk.item.properties.size).toBe("large");
    });
  });
});
