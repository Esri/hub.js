import { IHubCollection } from "../../search";
import {
  getWellKnownCatalog,
  WellKnownCatalog,
} from "../../search/wellKnownCatalog";
import { IUser } from "@esri/arcgis-rest-types";

export const getRecommendedTemplatesCatalog = (
  user: IUser,
  i18nScope: string
) => {
  const catalogNames: WellKnownCatalog[] = ["myContent", "organization"];

  const catalogs = catalogNames.map((name: WellKnownCatalog) => {
    const opts = { user };
    const catalog = getWellKnownCatalog(
      "initiativeTemplate.fields.recommendedTemplates",
      name,
      "item",
      opts
    );

    // manually attach recommended templates collection
    catalog.collections = [getRecommendedTemplatesCollection(i18nScope)];
    return catalog;
  });

  return catalogs;
};

const getRecommendedTemplatesCollection = (
  i18nScope: string
): IHubCollection => {
  return {
    targetEntity: "item",
    key: "recommendedTemplates",
    label: `${i18nScope}.fields.recommendedTemplates.collection.label`,
    scope: {
      targetEntity: "item",
      filters: [
        {
          predicates: [
            {
              type: "Solution",
            },
          ],
        },
        {
          predicates: [
            {
              typekeywords: ["hubSolutionTemplate"],
            },
            {
              typekeywords: ["Template"],
            },
          ],
          operation: "OR",
        },
      ],
    },
  };
};
