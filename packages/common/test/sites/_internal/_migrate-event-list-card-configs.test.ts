import { IModel, cloneObject, IDraft, setProp } from "../../../src";
import { _migrateEventListCardConfigs } from "../../../src/sites/_internal/_migrate-event-list-card-configs";
import { draftModelOneThree } from "../../fixtures/historical-site-draft-schemas/1-3";

const siteModel = {
  item: {
    id: "3ef",
    title: "Some Site",
    type: "Hub Site",
    properties: {
      schemaVersion: 1.3,
    },
  },
  data: {
    values: {
      layout: {
        sections: [
          {
            rows: [
              {
                cards: [
                  {
                    component: {
                      name: "event-list-card",
                      settings: {
                        cardVersion: 2,
                        initiativeIds: ["27335deab4ac4afba9b7e46f11a72705"],
                        calendarEnabled: false,
                        eventListTitleAlign: "left",
                        listEnabled: true,
                        showTitle: true,
                        title: "List of Upcoming Events",
                        subtitle: "Location",
                        display: {
                          dropShadow: "none",
                          cornerStyle: "square",
                          colorPalette: "custom",
                        },
                        cardId: "cxaugogd8",
                        textColor: "#000000",
                        backgroundColor: "#ffffff",
                      },
                    },
                    width: 12,
                  },
                ],
              },
              {
                cards: [
                  {
                    component: {
                      name: "markdown-card",
                      settings: {
                        schemaVersion: 2.1,
                        markdown:
                          '<h4 style="color: rgb(0, 0, 0);"><b>Dataset Type Items</b></h4>',
                      },
                    },
                    width: 12,
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
} as unknown as IModel;

describe("_ensure-event-list-card", () => {
  describe("Site model", function () {
    let model: IModel;

    beforeEach(function () {
      model = cloneObject(siteModel);
    });

    it("sets displayMode to list and deletes calendarEnabled when false", function () {
      const expected: IModel = cloneObject(model);
      expected.data.values.layout.sections[0].rows[0].cards[0].component.settings.displayMode =
        "list";
      delete expected.data.values.layout.sections[0].rows[0].cards[0].component
        .settings.calendarEnabled;
      setProp("item.properties.schemaVersion", 1.6, expected);
      const results = _migrateEventListCardConfigs<IModel>(model);
      expect(results).toEqual(expected);
    });
    it("sets displayMode to calendar and deletes calendarEnabled when true", function () {
      model.data.values.layout.sections[0].rows[0].cards[0].component.settings.calendarEnabled =
        true;
      const expected: IModel = cloneObject(model);
      expected.data.values.layout.sections[0].rows[0].cards[0].component.settings.displayMode =
        "calendar";
      delete expected.data.values.layout.sections[0].rows[0].cards[0].component
        .settings.calendarEnabled;
      setProp("item.properties.schemaVersion", 1.6, expected);
      const results = _migrateEventListCardConfigs<IModel>(model);
      expect(results).toEqual(expected);
    });
    it("does not apply changes if schemaVersion is already 1.6", function () {
      setProp("item.properties.schemaVersion", 1.6, model);
      const expected: IModel = cloneObject(model);
      const results = _migrateEventListCardConfigs<IModel>(model);
      expect(results).toEqual(expected);
    });
  });

  describe("Site draft", function () {
    let model: IDraft;

    beforeEach(function () {
      model = cloneObject(draftModelOneThree);
    });

    it("sets displayMode to list and deletes calendarEnabled when false", function () {
      model.data.values.layout.sections[7].rows[0].cards[0].component.settings.calendarEnabled =
        false;
      const expected: IDraft = cloneObject(model);
      expected.data.values.layout.sections[7].rows[0].cards[0].component.settings.displayMode =
        "list";
      delete expected.data.values.layout.sections[7].rows[0].cards[0].component
        .settings.calendarEnabled;
      setProp("item.properties.schemaVersion", 1.6, expected);
      const results = _migrateEventListCardConfigs<IDraft>(model);
      expect(results).toEqual(expected);
    });
    it("sets displayMode to calendar and deletes calendarEnabled when true", function () {
      const expected: IDraft = cloneObject(model);
      expected.data.values.layout.sections[7].rows[0].cards[0].component.settings.displayMode =
        "calendar";
      delete expected.data.values.layout.sections[7].rows[0].cards[0].component
        .settings.calendarEnabled;
      setProp("item.properties.schemaVersion", 1.6, expected);
      const results = _migrateEventListCardConfigs<IDraft>(model);
      expect(results).toEqual(expected);
    });
    it("does not apply changes if schemaVersion is already 1.6", function () {
      setProp("item.properties.schemaVersion", 1.6, model);
      const expected: IDraft = cloneObject(model);
      const results = _migrateEventListCardConfigs<IDraft>(model);
      expect(results).toEqual(expected);
    });
  });
});
