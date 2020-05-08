import { getRowDependencies } from "../../src/layout";

import { ICard } from "../../src/layout/types";

describe("getRowDependencies", function() {
  it("all cards in row should should have dependencies extracted", function () {
    const row = {
      cards: [
        {
          component: {
            name: 'webmap-card',
            settings: {
              webmap: [
                'component.settings.webmap value 1',
                'component.settings.webmap value 2'
              ]
            }
          }
        },
        {
          component: {
            name: 'items/gallery-card',
            settings: {
              ids: [
                'component.settings.ids value 1',
                'component.settings.ids value 2',
              ]
            }
          }
        }
      ]
    }

    expect(getRowDependencies(row)).toEqual([
      'component.settings.webmap value 1',
      'component.settings.webmap value 2',
      'component.settings.ids value 1',
      'component.settings.ids value 2'
    ])
  });

  it("empty row.cards should return an empty array", function () {
    const row = {
      cards: [] as ICard[]
    }

    expect(getRowDependencies(row)).toEqual([])
  });
});
