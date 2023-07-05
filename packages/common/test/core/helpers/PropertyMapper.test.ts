import { IGroup } from "@esri/arcgis-rest-portal";
import { CANNOT_DISCUSS, IModel } from "../../../src";
import {
  IPropertyMap,
  mapEntityToStore,
  mapStoreToEntity,
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
          entityKey: "color",
          storeKey: "item.properties.color",
        },
      ];
      const chk = mapEntityToStore(obj, model, mappings);
      expect(chk.item.properties.color).toBe("red");
      expect(chk.item.properties.other).toBe("prop");
    });
    it("skips missing props", () => {
      const mappings: IPropertyMap[] = [
        {
          entityKey: "color",
          storeKey: "item.properties.color",
        },
        {
          entityKey: "missing",
          storeKey: "item.properties.missing",
        },
      ];
      const chk = mapEntityToStore(obj, model, mappings);
      expect(chk.item.properties.color).toBe("red");
      expect(chk.item.properties.other).toBe("prop");
      expect(chk.item.properties.missing).toBeUndefined();
    });
    it("removes CANNOT_DISCUSS from typeKeywords when isDiscussable is true", () => {
      obj.isDiscussable = true;
      model.item.typeKeywords = [CANNOT_DISCUSS, "another prop"];
      const mappings: IPropertyMap[] = [];
      const chk = mapEntityToStore(obj, model, mappings);
      expect(chk.item.typeKeywords?.includes(CANNOT_DISCUSS)).toBeFalsy();
    });
    it("adds CANNOT_DISCUSS to typeKeywords when isDiscussable is false", () => {
      obj.isDiscussable = false;
      const mappings: IPropertyMap[] = [];
      const chk = mapEntityToStore(obj, model, mappings);
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
          entityKey: "color",
          storeKey: "item.properties.color",
        },
      ];
      const chk = mapStoreToEntity(model, obj, mappings);
      expect(chk.color).toBe("blue");
    });
    it("skips missing props", () => {
      const mappings: IPropertyMap[] = [
        {
          entityKey: "color",
          storeKey: "item.properties.color",
        },
        {
          entityKey: "missing",
          storeKey: "item.properties.missing",
        },
      ];
      const chk = mapStoreToEntity(model, obj, mappings);
      expect(chk.color).toBe("blue");
      expect(chk.missing).toBeUndefined();
    });
    it("sets isDiscussable to false when typeKeywords contains CANNOT_DISCUSS", () => {
      model.item.typeKeywords = [CANNOT_DISCUSS];
      obj.isDiscussable = true;
      const mappings: IPropertyMap[] = [];
      const chk = mapStoreToEntity(model, obj, mappings);
      expect(chk.isDiscussable).toBeFalsy();
    });
  });
  describe("PropertyMapper works with IModel", () => {
    let pm: PropertyMapper<any, IModel>;
    const obj = {
      size: "large",
    } as any;
    const model = {
      item: {
        id: "3ef",
        properties: { other: "prop", color: "blue" },
        itemControl: "update",
      },
      data: {},
    } as unknown as IModel;
    beforeEach(() => {
      const mappings: IPropertyMap[] = [
        {
          entityKey: "color",
          storeKey: "item.properties.color",
        },
        {
          entityKey: "size",
          storeKey: "item.properties.size",
        },
      ];
      pm = new PropertyMapper(mappings);
    });
    it("maps model to object", () => {
      const chk = pm.storeToEntity(model, obj);
      expect(chk.color).toBe("blue");
    });
    it("maps object to model", () => {
      const chk = pm.entityToStore(obj, model);
      expect(chk.item.properties.size).toBe("large");
    });
  });
  describe("PropertyMapper work with IGroup", () => {
    let pm: PropertyMapper<any, IGroup>;
    const obj = {
      tags: ["one", "two"],
      name: "Red Roses",
    } as any;
    const grp = {
      title: "Blue Roses",
      tags: ["three", "four"],
    } as unknown as IGroup;
    beforeEach(() => {
      const mappings: IPropertyMap[] = [
        {
          entityKey: "name",
          storeKey: "title",
        },
        {
          entityKey: "tags",
          storeKey: "tags",
        },
      ];
      pm = new PropertyMapper(mappings);
    });
    it("maps model to group", () => {
      const chk = pm.storeToEntity(grp, obj);
      expect(chk.name).toBe("Blue Roses");
    });
    it("maps group to model", () => {
      const chk = pm.entityToStore(obj, grp);
      expect(chk.title).toBe("Red Roses");
    });
  });
});
