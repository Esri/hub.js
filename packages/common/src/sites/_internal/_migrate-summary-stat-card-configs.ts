import { setProp } from "../../objects";
import { IModel, IDraft } from "../../types";
import { cloneObject } from "../../util";

/**
 * Reconfigure summary stat card properties to align with the
 * new web component card.
 * @private
 * @param {Object} model Site Model
 * @returns {Object}
 */
export function _migrateSummaryStatCardConfigs<T extends IModel | IDraft>(
  model: T
): T {
  // TODO: fill in
  // attempt migration for _______ schema version
  const migratedModel = _migrateSummaryStatSchemaVersion1_7(model);
  return migratedModel;
}

function _migrateSummaryStatSchemaVersion1_7<T extends IModel | IDraft>(
  model: T
): T {
  // do nothing if migration already applied
  if (model.item.properties?.schemaVersion >= 1.7) return model;

  // apply migration
  const clone = cloneObject(model);
  clone.data.values.layout.sections.map((section: any) => ({
    ...section,
    rows: (section.rows || []).map((row: any) => ({
      ...row,
      cards: (row.cards || []).map((card: any) => {
        if (card.component.name === "summary-statistic-card") {
          const values = card.component.settings;
          card.component.settings = {
            type: "dynamic",
            cardTitle: values.title,
            dynamicMetric: {
              itemId: [values.itemId],
              layerId: values.layerId?.toString(),
              field: values.statFieldName,
              fieldType: values.statFieldType,
              statistic: values.statType,
              serviceUrl: values.url?.endsWith("FeatureServer")
                ? values.url
                : values.url?.slice(
                    0,
                    values.url?.lastIndexOf("FeatureServer") + 13
                  ),
            },
            serverTimeout: values.serverTimeout,
            where: values.where,
            textAlign: migrateTextAlign(values.statValueAlign),
            valueColor:
              values.statValueColor === null
                ? undefined
                : values.statValueColor,
            trailingText: values.trailingText,
            cardId: values.cardId,

            // did not exist on old stat card
            allowUnitFormatting: false,
            allowLink: false,
          };

          delete card.component.settings.title;
          delete card.component.settings.statFieldName;
          delete card.component.settings.statFieldType;
          delete card.component.settings.statType;
          delete card.component.settings.statValueAlign;
          delete card.component.settings.statValueColor;
          delete card.component.settings.itemTitle;
          delete card.component.settings.layerName;
          delete card.component.settings.currencyCode;
          delete card.component.settings.decimalPlaces;
          delete card.component.settings.formatNumberGroupings;
          delete card.component.settings.leadingText;
          delete card.component.settings.showAsCurrency;
          delete card.component.settings.titleAlign;
          delete card.component.settings.trailingTextAlign;
        }
        return card;
      }),
    })),
  }));

  setProp("item.properties.schemaVersion", 1.6, clone);
  return clone;
}

function migrateTextAlign(align: string): string {
  switch (align) {
    case "left":
      return "start";
    case "center":
      return "center";
    case "right":
      return "end";
  }
}
