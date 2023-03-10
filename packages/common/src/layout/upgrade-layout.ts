import { cloneObject } from "../util";
import { IHubLayout } from "../core";

// TODO: we need to know which cards have migrations.... not sure the best way to do that but here is a first stab
const migrations: Record<
  string,
  (card: Record<string, any>) => Record<string, any>
> = {
  // the individual card migration functions will be imported modules, of course
  // TODO: and they will need a version number so we can know if we need to apply them
  "event-list-card": (card: Record<string, any>) => card,
};

export function upgradeCardConfig(card: any): any {
  card = cloneObject(card);
  if (card.component.name in migrations) {
    card = migrations[card.component.name](card);
  }
  return card;
}

export function upgradeLayout(layout: IHubLayout): IHubLayout {
  // do nothing if migration already applied - we'll need to add a version or schemaVersion to the layout and also probably to the individual cards
  // if (layout.schemaVersion >= 0) return layout;

  // TODO: we'll need to upgrade the layout data structure to match the new layout system....

  // and also migrate individual cards
  const clone = cloneObject(layout);
  clone.sections.map((section: any) => ({
    ...section,
    rows: section.rows.map((row: any) => ({
      ...row,
      cards: row.cards.map(upgradeCardConfig),
    })),
  }));

  // increment schemaVersion
  // clone.schemaVersion = 1.6;

  return clone;
}
