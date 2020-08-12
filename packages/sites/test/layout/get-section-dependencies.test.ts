import { getSectionDependencies } from "../../src/layout";

describe("getSectionDependencies", function() {
  it("all cards in all row in section should should have dependencies extracted", function() {
    const section = {
      rows: [
        {
          cards: [
            {
              component: {
                name: "webmap-card",
                settings: {
                  webmap: [
                    "component.settings.webmap value 1",
                    "component.settings.webmap value 2"
                  ]
                }
              }
            },
            {
              component: {
                name: "items/gallery-card",
                settings: {
                  ids: [
                    "component.settings.ids value 1",
                    "component.settings.ids value 2"
                  ]
                }
              }
            }
          ]
        },
        {
          cards: [
            {
              component: {
                name: "items/gallery-card",
                settings: {
                  ids: [
                    "component.settings.ids value 3",
                    "component.settings.ids value 4"
                  ]
                }
              }
            },
            {
              component: {
                name: "webmap-card",
                settings: {
                  webmap: [
                    "component.settings.webmap value 3",
                    "component.settings.webmap value 4"
                  ]
                }
              }
            }
          ]
        }
      ]
    };

    expect(getSectionDependencies(section)).toEqual([
      "component.settings.webmap value 1",
      "component.settings.webmap value 2",
      "component.settings.ids value 1",
      "component.settings.ids value 2",
      "component.settings.ids value 3",
      "component.settings.ids value 4",
      "component.settings.webmap value 3",
      "component.settings.webmap value 4"
    ]);
  });
});
