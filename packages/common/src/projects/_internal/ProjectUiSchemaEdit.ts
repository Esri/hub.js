import { IArcGISContext } from "../../ArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { getFeaturedContentCatalogs } from "../../core/schemas/internal/getFeaturedContentCatalogs";
import { getLocationExtent } from "../../core/schemas/internal/getLocationExtent";
import { getLocationOptions } from "../../core/schemas/internal/getLocationOptions";
import { getTagItems } from "../../core/schemas/internal/getTagItems";
import { getThumbnailUiSchemaElement } from "../../core/schemas/internal/getThumbnailUiSchemaElement";
import { IHubProject } from "../../core/types";
import { getAuthedImageUrl } from "../../core/_internal/getAuthedImageUrl";
import { fetchCategoriesUiSchemaElement } from "../../core/schemas/internal/fetchCategoriesUiSchemaElement";

/**
 * @private
 * constructs the complete edit uiSchema for Hub Projects.
 * This defines how the schema properties should be
 * rendered in the project editing experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: Partial<IHubProject>,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        elements: [
          {
            type: "Control",
            scope: "/properties/catalogs",
            options: {
              control: "hub-composite-input-catalog-builder",
            },
          },
        ],
      },
    ],
  };
};
