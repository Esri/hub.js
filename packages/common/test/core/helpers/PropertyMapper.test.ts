import { CANNOT_DISCUSS, IModel } from "../../../src";
import {
  IPropertyMap,
  mapObjectToModel,
  mapModelToObject,
  PropertyMapper,
} from "../../../src/core/_internal/PropertyMapper";

describe("PropertyMapper:", () => {
  describe("mapObjectToModel:", () => {
    const obj = {
      color: "red",
      isDiscussable: false,
    };
    const model = {
      item: { id: "3ef", properties: { other: "prop" }, typeKeywords: [] },
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
    it("removes CANNOT_DISCUSS from typeKeywords when isDiscussable is true", () => {
      obj.isDiscussable = true;
      model.item.typeKeywords = [CANNOT_DISCUSS, "another prop"];
      const mappings: IPropertyMap[] = [];
      const chk = mapObjectToModel(obj, model, mappings);
      expect(chk.item.typeKeywords?.includes(CANNOT_DISCUSS)).toBeFalsy();
    });
    it("adds CANNOT_DISCUSS to typeKeywords when isDiscussable is false", () => {
      obj.isDiscussable = false;
      const mappings: IPropertyMap[] = [];
      const chk = mapObjectToModel(obj, model, mappings);
      expect(chk.item.typeKeywords?.includes(CANNOT_DISCUSS)).toBeTruthy();
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
    it("sets isDiscussable to false when typeKeywords contains CANNOT_DISCUSS", () => {
      model.item.typeKeywords = [CANNOT_DISCUSS];
      obj.isDiscussable = true;
      const mappings: IPropertyMap[] = [];
      const chk = mapModelToObject(model, obj, mappings);
      expect(chk.isDiscussable).toBeFalsy();
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
