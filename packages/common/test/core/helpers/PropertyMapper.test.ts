import { IModel } from "../../../src";
import {
  IPropertyMap,
  mapObjectToModel,
  mapModelToObject,
  PropertyMapper,
} from "../../../src/core/helpers/PropertyMapper";

describe("PropertyMapper:", () => {
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
