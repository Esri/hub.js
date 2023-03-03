import {
  IModel,
  IDraft,
  getProp,
  cloneObject,
  deleteProp,
  setProp,
} from "../..";

/**
 * Add telemetry config object
 * @private
 * @param {object} model Site Model
 * @returns {object}
 */
export function _ensureEventListCard<T extends IModel | IDraft>(model: T): T {
  const clone = cloneObject(model);
  clone.data.values.layout.sections.forEach(
    (section: any, sectionIndex: number) => {
      section.rows.forEach((row: any, rowIndex: number) => {
        row.cards.forEach((card: any, cardIndex: number) => {
          if (card.component.name === "event-list-card") {
            // const path = `data.values.layout.sections[${sectionIndex}].rows[${rowIndex}].cards[${cardIndex}].component.settings`;
            const displayMode = card.component.settings.calendarEnabled
              ? "calendar"
              : "list";
            // setProp(`${path}.displayMode`, displayMode, clone);
            clone.data.values.layout.sections[sectionIndex].rows[
              rowIndex
            ].cards[cardIndex].component.settings.displayMode = displayMode;
            // deleteProp(clone, `${path}.calendarEnabled`);
            delete clone.data.values.layout.sections[sectionIndex].rows[
              rowIndex
            ].cards[cardIndex].component.settings.calendarEnabled;
          }
        });
      });
    }
  );
  return clone;
}
