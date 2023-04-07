import { setProp } from "../../objects";
import { IModel, IDraft } from "../../types";
import { cloneObject } from "../../util";

/**
 * Reconfigure event list card properties
 * @private
 * @param {object} model Site Model
 * @returns {object}
 */
export function _migrateEventListCardConfigs<T extends IModel | IDraft>(
  model: T
): T {
  // do nothing if migration already applied
  if (model.item.properties?.schemaVersion >= 1.6) return model;

  // apply migration
  const clone = cloneObject(model);
  clone.data.values.layout.sections.map((section: any) => ({
    ...section,
    rows: (section.rows || []).map((row: any) => ({
      ...row,
      cards: (row.cards || []).map((card: any) => {
        if (card.component.name === "event-list-card") {
          card.component.settings.displayMode = card.component.settings
            .calendarEnabled
            ? "calendar"
            : "list";
          delete card.component.settings.calendarEnabled;
        }
        return card;
      }),
    })),
  }));

  // increment schemaVersion
  setProp("item.properties.schemaVersion", 1.6, clone);

  return clone;
}
