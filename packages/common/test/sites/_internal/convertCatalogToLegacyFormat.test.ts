import { IItem } from "@esri/arcgis-rest-portal";
import {
  convertCatalogToLegacyFormat,
  catalogToLegacy,
} from "../../../src/sites/_internal/convertCatalogToLegacyFormat";
import { IModel } from "../../../src/hub-types";
import { IHubCatalog } from "../../../src";

describe("utils:", () => {
  describe("catalogToLegacy:", () => {
    it("only makes changes if catalog has item scope", () => {
      const catalog: IHubCatalog = {
        schemaVersion: 1,
        scopes: {
          event: {
            targetEntity: "event",
            filters: [
              {
                predicates: [
                  {
                    type: "Event",
                  },
                ],
              },
            ],
          },
        },
      };

      const chk = catalogToLegacy(catalog);
      expect(chk).toEqual({ groups: [] });
    });
    it("works with scopeless catalog", () => {
      const catalog: IHubCatalog = {
        schemaVersion: 1,
        collections: [],
      };

      const chk = catalogToLegacy(catalog);
      expect(chk).toEqual({ groups: [] });
    });
  });
  describe("convertCatalogToLegacyFormat", () => {
    it("leaves the old catalog untouched if no group predicate is present", () => {
      const modelToUpdate = {
        item: {} as IItem,
        data: {
          catalog: {
            scopes: {
              item: {
                targetEntity: "item",
                filters: [
                  {
                    predicates: [
                      {
                        type: "Feature Service",
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
      } as IModel;
      const currentModel = {
        item: {} as IItem,
        data: {
          catalog: { groups: ["00c", "00d"] },
        },
      } as IModel;
      const chk = convertCatalogToLegacyFormat(modelToUpdate, currentModel);

      expect(chk.data?.catalog).toEqual({ groups: ["00c", "00d"] });
    });

    it("converts the catalog if the group predicate has a single id", () => {
      const modelToUpdate = {
        item: {} as IItem,
        data: {
          catalog: {
            scopes: {
              item: {
                targetEntity: "item",
                filters: [
                  {
                    predicates: [
                      {
                        group: "9001",
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
      } as IModel;
      const currentModel = {
        item: {} as IItem,
        data: {
          catalog: { groups: ["00c", "00d"] },
        },
      } as IModel;
      const chk = convertCatalogToLegacyFormat(modelToUpdate, currentModel);

      expect(chk.data?.catalog).toEqual({ groups: ["9001"] });
    });

    it("converts the catalog if the group predicate has multiple ids", () => {
      const modelToUpdate = {
        item: {} as IItem,
        data: {
          catalog: {
            scopes: {
              item: {
                targetEntity: "item",
                filters: [
                  {
                    predicates: [
                      {
                        group: ["9001", "1006"],
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
      } as IModel;
      const currentModel = {
        item: {} as IItem,
        data: {
          catalog: { groups: ["00c", "00d"] },
        },
      } as IModel;
      const chk = convertCatalogToLegacyFormat(modelToUpdate, currentModel);

      expect(chk.data?.catalog).toEqual({ groups: ["9001", "1006"] });
    });
  });
});
