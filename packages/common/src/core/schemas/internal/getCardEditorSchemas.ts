import {
  CardEditorType,
  IEditorConfig,
  StatCardEditorType,
  FollowCardEditorType,
} from "../types";
import { getCardType } from "./getCardType";
import { filterSchemaToUiSchema } from "./filterSchemaToUiSchema";
import {
  CardEditorOptions,
  EmbedCardEditorOptions,
  EventGalleryCardEditorOptions,
  FollowCardEditorOptions,
  StatCardEditorOptions,
} from "./EditorOptions";
import { cloneObject } from "../../../util";
import type { IArcGISContext } from "../../../types/IArcGISContext";
import { ICardEditorModuleType } from "../types";
import { MetricSchema } from "./metrics/MetricSchema";
import { FollowSchema } from "./follow/FollowSchema";
import { EmbedCardSchema } from "./embed/EmbedSchema";
import { EventGalleryCardSchema } from "./events/EventGalleryCardSchema";
import * as buildStatUiSchema from "./metrics/StatCardUiSchema";
import * as buildFollowUiSchema from "./follow/FollowCardUiSchema";
import * as buildEmbedSchema from "./embed/EmbedUiSchema";
import * as buildEventGalleryCardSchema from "./events/EventGalleryCardUiSchema";

/**
 * get the editor schema and uiSchema defined for a layout card.
 * The schema and uiSchema that are returned can be used to
 * render a form UI (using the configuration editor).
 *
 * @param i18nScope  translation scope to be interpolated into the uiSchema
 * @param type editor type - corresponds to the returned uiSchema
 * @param options optional hash of dynamic uiSchema element options
 * @param context
 * @returns
 */
export async function getCardEditorSchemas(
  i18nScope: string,
  type: CardEditorType,
  options: CardEditorOptions,
  context: IArcGISContext
): Promise<IEditorConfig> {
  const cardType = getCardType(type);
  let schema;
  let uiSchema;
  let defaults;

  switch (cardType) {
    case "stat": {
      const MODULES: Record<StatCardEditorType, ICardEditorModuleType> = {
        "hub:card:stat": buildStatUiSchema,
      } as Record<StatCardEditorType, ICardEditorModuleType>;
      const module = MODULES[type as StatCardEditorType];
      schema = cloneObject(MetricSchema);
      uiSchema = await module.buildUiSchema(
        i18nScope,
        options as StatCardEditorOptions,
        context
      );
      // if we have buildDefaults, build the defaults
      // TODO: when first implementing buildDefaults for initiative templates, remove the ignore line

      /* istanbul ignore next */
      if (module.buildDefaults) {
        defaults = module.buildDefaults(i18nScope, options, context);
      }

      break;
    }
    case "follow": {
      const MODULES: Record<FollowCardEditorType, ICardEditorModuleType> = {
        "hub:card:follow": buildFollowUiSchema,
      } as Record<FollowCardEditorType, ICardEditorModuleType>;
      const module = MODULES[type as FollowCardEditorType];
      schema = cloneObject(FollowSchema);
      uiSchema = await module.buildUiSchema(
        i18nScope,
        options as FollowCardEditorOptions,
        context
      );
      break;
    }
    case "embed": {
      schema = cloneObject(EmbedCardSchema);
      uiSchema = buildEmbedSchema.buildUiSchema(
        i18nScope,
        options as EmbedCardEditorOptions,
        context
      );
      defaults = { embeds: [] };
      break;
    }
    case "eventGallery": {
      schema = cloneObject(EventGalleryCardSchema);
      uiSchema = await buildEventGalleryCardSchema.buildUiSchema(
        i18nScope,
        options as EventGalleryCardEditorOptions,
        context
      );
      break;
    }
  }
  // filter out properties not used in uiSchema
  schema = filterSchemaToUiSchema(schema, uiSchema);

  return Promise.resolve({ schema, uiSchema, defaults });
}
