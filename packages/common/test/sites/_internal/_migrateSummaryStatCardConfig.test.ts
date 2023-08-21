import { _migrateSummaryStatCardConfigs } from "../../../src/sites/_internal/_migrate-summary-stat-card-configs";
import { IModel, cloneObject, IDraft, setProp } from "../../../src";

function getSiteModel(cardSettings: Record<string, any>) {
  return {
    item: {
      id: "3ef",
      title: "Some Site",
      type: "Hub Site",
      properties: {
        schemaVersion: 1.6,
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
                        name: "summary-statistic-card",
                        settings: cardSettings,
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
}

function getCardSettings(
  align: string,
  where: string | undefined,
  color: string | null
) {
  return {
    cardId: "cmmqtolwk",
    currencyCode: "USD",
    decimalPlaces: 2,
    formatNumberGroupings: true,
    itemId: "60dfdb1f778c4480b8c4135b1e9a2ecb",
    itemTitle: "Field Type Table",
    layerId: 0,
    layerName: "Table",
    leadingText: "",
    showAsCurrency: false,
    statFieldName: "Float",
    statFieldType: "esriFieldTypeDouble",
    statType: "sum",
    statValueAlign: align,
    statValueColor: color,
    timeout: 30,
    title: "Statistic Title",
    titleAlign: "left",
    trailingText: "trailing text...",
    trailingTextRight: "right",
    url: "https://servicesqa.arcgis.com/Xj56SBi2udA78cC9/arcgis/rest/services/Field_Type_Table/FeatureServer/0",
    where,
  };
}

function getExpectedCardSettings(
  textAlign: string,
  expressionSet: Record<string, any>,
  color: string | undefined
) {
  return {
    cardId: "cmmqtolwk",
    dynamicMetric: {
      itemId: ["60dfdb1f778c4480b8c4135b1e9a2ecb"],
      layerId: "0",
      field: "Float",
      fieldType: "esriFieldTypeDouble",
      statistic: "sum",
      serviceUrl:
        "https://servicesqa.arcgis.com/Xj56SBi2udA78cC9/arcgis/rest/services/Field_Type_Table/FeatureServer",
      expressionSet,
    },
    type: "dynamic",
    cardTitle: "Statistic Title",
    serverTimeout: 30,
    textAlign,
    valueColor: color,
    trailingText: "trailing text...",
    allowUnitFormatting: false,
    allowLink: false,
    allowExpressionSet: !!expressionSet,
  };
}

const modelWithBadLayout = {
  item: {
    properties: {
      schemaVersion: 1.5,
    },
  },
  data: {
    values: {
      layout: {
        sections: [
          {
            rows: [
              {
                cards: [],
              },
              {
                otherProp:
                  "This is an invalid row, lacking a .cards prop - it should be ignored",
              },
            ],
          },
          {
            otherProp:
              "this is an invalid section lacking a .rows prop - it should just be ignored",
          },
        ],
      },
    },
  },
} as unknown as IModel;

describe("_ensure-summary-stat-card", () => {
  describe("Site model", function () {
    let model: IModel;

    it("does not apply changes if schemaVersion is already 1.7", function () {
      model = cloneObject(getSiteModel(getCardSettings("left", "", null)));
      setProp("item.properties.schemaVersion", 1.7, model);
      const expected: IModel = cloneObject(model);
      const results = _migrateSummaryStatCardConfigs<IModel>(model);
      expect(results).toEqual(expected);
    });

    it("does not apply changes if invalid model", function () {
      model = cloneObject(getSiteModel(getCardSettings("left", "", null)));
      const expected: IModel = cloneObject(modelWithBadLayout);
      setProp("item.properties.schemaVersion", 1.7, expected);
      const results =
        _migrateSummaryStatCardConfigs<IModel>(modelWithBadLayout);
      expect(results).toEqual(expected);
    });

    describe("text align & color variations", function () {
      it('sets a site model accurately: align = left, where = "", color = null', () => {
        model = cloneObject(getSiteModel(getCardSettings("left", "", null)));
        const expected: IModel = cloneObject(
          getSiteModel(getExpectedCardSettings("start", [], undefined))
        );
        setProp("item.properties.schemaVersion", 1.7, expected);
        const results = _migrateSummaryStatCardConfigs<IModel>(model);
        expect(results).toEqual(expected);
      });

      it('sets a site model accurately: align = center, where = "", color = null', () => {
        model = cloneObject(getSiteModel(getCardSettings("center", "", null)));
        const expected: IModel = cloneObject(
          getSiteModel(getExpectedCardSettings("center", [], undefined))
        );
        setProp("item.properties.schemaVersion", 1.7, expected);
        const results = _migrateSummaryStatCardConfigs<IModel>(model);
        expect(results).toEqual(expected);
      });

      it('sets a site model accurately: align = right, where = "", color = null', () => {
        model = cloneObject(getSiteModel(getCardSettings("right", "", null)));
        const expected: IModel = cloneObject(
          getSiteModel(getExpectedCardSettings("end", [], undefined))
        );
        setProp("item.properties.schemaVersion", 1.7, expected);
        const results = _migrateSummaryStatCardConfigs<IModel>(model);
        expect(results).toEqual(expected);
      });

      it('sets a site model accurately: align = left, where = "", color = "#a4a4a4"', () => {
        model = cloneObject(
          getSiteModel(getCardSettings("left", "", "#a4a4a4"))
        );
        const expected: IModel = cloneObject(
          getSiteModel(getExpectedCardSettings("start", [], "#a4a4a4"))
        );
        setProp("item.properties.schemaVersion", 1.7, expected);
        const results = _migrateSummaryStatCardConfigs<IModel>(model);
        expect(results).toEqual(expected);
      });
    });
  });

  describe("Site draft", function () {
    // TODO: once site draft is implemented (two PRs needed), write these
  });

  describe("WhereToExpressionSet", function () {
    let model: IModel;

    it("handles a case of a string, dates, and numbers", () => {
      const where =
        "String = 'a' AND Date >= TIMESTAMP '2023-01-01 00:00:00' AND Date <= TIMESTAMP '2023-01-03 23:59:59' AND SmInteger >= 1 AND SmInteger <= 1";
      const expressionSet = [
        {
          field: { name: "String", type: "esriFieldTypeString" },
          values: ["a"],
        },
        {
          field: { name: "Date", type: "esriFieldTypeDate" },
          values: ["2023-01-01"],
        },
        {
          field: { name: "Date", type: "esriFieldTypeDate" },
          values: [undefined, "2023-01-03"],
        },
        {
          field: { name: "SmInteger", type: undefined },
          values: ["1"],
        },
        {
          field: { name: "SmInteger", type: undefined },
          values: [undefined, "1"],
        },
      ];
      model = cloneObject(getSiteModel(getCardSettings("left", where, null)));

      const expected: IModel = cloneObject(
        getSiteModel(getExpectedCardSettings("start", expressionSet, undefined))
      );
      setProp("item.properties.schemaVersion", 1.7, expected);
      const results = _migrateSummaryStatCardConfigs<IModel>(model);
      expect(results).toEqual(expected);
    });

    it("handles a case of string, dates, and numbers case 2", () => {
      const where =
        " Float <= 4.55 AND Field Name = 'This is a string' AND Date >= TIMESTAMP '2023-07-17 00:00:00' AND Float >= 3.99 AND Date <= TIMESTAMP '2023-07-17 23:59:59'";
      const expressionSet = [
        {
          field: { name: "Float", type: undefined },
          values: [undefined, "4.55"],
        },
        {
          field: { name: "Field Name", type: "esriFieldTypeString" },
          values: ["This is a string"],
        },
        {
          field: { name: "Date", type: "esriFieldTypeDate" },
          values: ["2023-07-17"],
        },
        {
          field: { name: "Float", type: undefined },
          values: ["3.99"],
        },
        {
          field: { name: "Date", type: "esriFieldTypeDate" },
          values: [undefined, "2023-07-17"],
        },
      ];
      model = cloneObject(getSiteModel(getCardSettings("left", where, null)));

      const expected: IModel = cloneObject(
        getSiteModel(getExpectedCardSettings("start", expressionSet, undefined))
      );
      setProp("item.properties.schemaVersion", 1.7, expected);
      const results = _migrateSummaryStatCardConfigs<IModel>(model);
      expect(results).toEqual(expected);
    });

    it("handles a case of one clause", () => {
      const where = "Float <= 4.55";
      const expressionSet = [
        {
          field: { name: "Float" },
          values: [undefined, "4.55"],
        },
      ];
      model = cloneObject(getSiteModel(getCardSettings("left", where, null)));

      const expected: IModel = cloneObject(
        getSiteModel(getExpectedCardSettings("start", expressionSet, undefined))
      );
      setProp("item.properties.schemaVersion", 1.7, expected);
      const results = _migrateSummaryStatCardConfigs<IModel>(model);
      expect(results).toEqual(expected);
    });

    it("handles an empty where clause", () => {
      const expressionSet: Array<Record<string, any>> = [];
      model = cloneObject(
        getSiteModel(getCardSettings("left", undefined, null))
      );

      const expected: IModel = cloneObject(
        getSiteModel(getExpectedCardSettings("start", expressionSet, undefined))
      );
      setProp("item.properties.schemaVersion", 1.7, expected);
      const results = _migrateSummaryStatCardConfigs<IModel>(model);
      expect(results).toEqual(expected);
    });
  });
});
