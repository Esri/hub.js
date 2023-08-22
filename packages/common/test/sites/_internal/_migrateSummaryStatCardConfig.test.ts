import { _migrateSummaryStatCardConfigs } from "../../../src/sites/_internal/_migrate-summary-stat-card-configs";
import { IModel, cloneObject, setProp, IDraft } from "../../../src";
import * as utils from "../../../src/util";
import { draftModelOneThree } from "../../fixtures/historical-site-draft-schemas/1-3";

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
      allowExpressionSet: !!expressionSet.length,
    },
    type: "dynamic",
    cardTitle: "Statistic Title",
    serverTimeout: 30,
    textAlign,
    valueColor: color,
    trailingText: "trailing text...",
    allowUnitFormatting: false,
    allowLink: false,
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

    let createIdSpy: jasmine.Spy;

    beforeEach(function () {
      createIdSpy = spyOn(utils, "createId").and.returnValue("mockCardId");
    });

    it("does not apply changes if schemaVersion is already 1.7", function () {
      model = cloneObject(getSiteModel(getCardSettings("left", "1=1", null)));
      setProp("item.properties.schemaVersion", 1.7, model);
      const expected: IModel = cloneObject(model);
      const results = _migrateSummaryStatCardConfigs<IModel>(model);
      expect(results).toEqual(expected);
    });

    it("does not apply changes if invalid model", function () {
      model = cloneObject(getSiteModel(getCardSettings("left", "1=1", null)));
      const expected: IModel = cloneObject(modelWithBadLayout);
      setProp("item.properties.schemaVersion", 1.7, expected);
      const results =
        _migrateSummaryStatCardConfigs<IModel>(modelWithBadLayout);
      expect(results).toEqual(expected);
    });

    it("handles an empty settings object", function () {
      model = cloneObject(getSiteModel({}));
      const expected: IModel = cloneObject(
        getSiteModel({
          type: "dynamic",
          cardTitle: undefined,
          dynamicMetric: {
            allowExpressionSet: false,
            itemId: [undefined],
            layerId: undefined,
            field: undefined,
            fieldType: undefined,
            statistic: undefined,
            serviceUrl: undefined,
            expressionSet: [],
          },
          textAlign: "start",
          serverTimeout: undefined,
          valueColor: undefined,
          trailingText: undefined,
          cardId: "mockCardId",
          allowUnitFormatting: false,
          allowLink: false,
        })
      );
      const result = _migrateSummaryStatCardConfigs<IModel>(model);
      setProp("item.properties.schemaVersion", 1.7, expected);
      expect(result).toEqual(expected);
      expect(createIdSpy).toHaveBeenCalledTimes(1);
    });

    it("handles formatting of url", function () {
      model = cloneObject(
        getSiteModel({
          url: "https://servicesqa.arcgis.com/Xj56SBi2udA78cC9/arcgis/rest/services/Field_Type_Table/FeatureServer",
        })
      );
      const expected: IModel = cloneObject(
        getSiteModel({
          type: "dynamic",
          cardTitle: undefined,
          dynamicMetric: {
            allowExpressionSet: false,
            itemId: [undefined],
            layerId: undefined,
            field: undefined,
            fieldType: undefined,
            statistic: undefined,
            serviceUrl:
              "https://servicesqa.arcgis.com/Xj56SBi2udA78cC9/arcgis/rest/services/Field_Type_Table/FeatureServer",
            expressionSet: [],
          },
          textAlign: "start",
          serverTimeout: undefined,
          valueColor: undefined,
          trailingText: undefined,
          cardId: "mockCardId",
          allowUnitFormatting: false,
          allowLink: false,
        })
      );
      const result = _migrateSummaryStatCardConfigs<IModel>(model);
      setProp("item.properties.schemaVersion", 1.7, expected);
      expect(result).toEqual(expected);
      expect(createIdSpy).toHaveBeenCalledTimes(1);
    });

    it("handles formatting of url with MapServer url", function () {
      model = getSiteModel({
        url: "https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Demographic_WebMercator/MapServer/40",
      });
      const expected: IModel = cloneObject(
        getSiteModel({
          type: "dynamic",
          cardTitle: undefined,
          dynamicMetric: {
            allowExpressionSet: false,
            itemId: [undefined],
            layerId: undefined,
            field: undefined,
            fieldType: undefined,
            statistic: undefined,
            serviceUrl:
              "https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Demographic_WebMercator/MapServer",
            expressionSet: [],
          },
          textAlign: "start",
          serverTimeout: undefined,
          valueColor: undefined,
          trailingText: undefined,
          cardId: "mockCardId",
          allowUnitFormatting: false,
          allowLink: false,
        })
      );
      const result = _migrateSummaryStatCardConfigs<IModel>(model);
      setProp("item.properties.schemaVersion", 1.7, expected);
      expect(result).toEqual(expected);
      expect(createIdSpy).toHaveBeenCalledTimes(1);
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
    let model: IDraft;
    let createIdSpy: jasmine.Spy;
    beforeEach(function () {
      model = cloneObject(draftModelOneThree);
      createIdSpy = spyOn(utils, "createId").and.returnValue("mockCardId");
    });
    it("correctly migrates a draft", function () {
      const expected: IDraft = cloneObject(model);
      expected.data.values.layout.sections[2].rows[1].cards[0].component.settings =
        {
          type: "dynamic",
          cardTitle: "Statistic Title",
          dynamicMetric: {
            itemId: [undefined],
            layerId: undefined,
            field: "",
            fieldType: "",
            statistic: "",
            serviceUrl: "",
            expressionSet: [],
            allowExpressionSet: false,
          },
          serverTimeout: undefined,
          textAlign: "start",
          valueColor: undefined,
          trailingText: "...",
          cardId: "mockCardId",
          allowUnitFormatting: false,
          allowLink: false,
        };
      expected.data.values.layout.sections[2].rows[1].cards[1].component.settings =
        {
          type: "dynamic",
          cardTitle: "Statistic Title",
          dynamicMetric: {
            itemId: [undefined],
            layerId: undefined,
            field: "",
            fieldType: "",
            statistic: "",
            serviceUrl: "",
            expressionSet: [],
            allowExpressionSet: false,
          },
          serverTimeout: undefined,
          textAlign: "start",
          valueColor: undefined,
          trailingText: "...",
          cardId: "mockCardId",
          allowUnitFormatting: false,
          allowLink: false,
        };
      expected.data.values.layout.sections[2].rows[1].cards[2].component.settings =
        {
          type: "dynamic",
          cardTitle: "Statistic Title",
          dynamicMetric: {
            itemId: [undefined],
            layerId: undefined,
            field: "",
            fieldType: "",
            statistic: "",
            serviceUrl: "",
            expressionSet: [],
            allowExpressionSet: false,
          },
          serverTimeout: undefined,
          textAlign: "start",
          valueColor: undefined,
          trailingText: "...",
          cardId: "mockCardId",
          allowUnitFormatting: false,
          allowLink: false,
        };
      setProp("item.properties.schemaVersion", 1.7, expected);
      const results = _migrateSummaryStatCardConfigs<IDraft>(model);
      expect(results).toEqual(expected);
      expect(createIdSpy).toHaveBeenCalledTimes(3);
    });
    it("does not apply changes if schemaVersion is already 1.7", function () {
      setProp("item.properties.schemaVersion", 1.7, model);
      const expected: IDraft = cloneObject(model);
      const results = _migrateSummaryStatCardConfigs<IDraft>(model);
      expect(results).toEqual(expected);
    });
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
          field: { name: "SmInteger" },
          values: ["1"],
        },
        {
          field: { name: "SmInteger" },
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
          field: { name: "Float" },
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
          field: { name: "Float" },
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

    it("handles a case of one clause: float", () => {
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

    it("handles where 1=1", () => {
      const where = "1=1";
      const expressionSet: Array<Record<string, any>> = [];
      model = cloneObject(getSiteModel(getCardSettings("left", where, null)));

      const expected: IModel = cloneObject(
        getSiteModel(getExpectedCardSettings("start", expressionSet, undefined))
      );
      setProp("item.properties.schemaVersion", 1.7, expected);
      const results = _migrateSummaryStatCardConfigs<IModel>(model);
      expect(results).toEqual(expected);
    });

    it("handles a malformatted clause", () => {
      const where = "incorrect";
      const expressionSet: Array<Record<string, any>> = [];
      model = cloneObject(getSiteModel(getCardSettings("left", where, null)));

      const expected: IModel = cloneObject(
        getSiteModel(getExpectedCardSettings("start", expressionSet, undefined))
      );
      setProp("item.properties.schemaVersion", 1.7, expected);
      const results = _migrateSummaryStatCardConfigs<IModel>(model);
      expect(results).toEqual(expected);
    });

    it("handles a malformatted clause with a sign", () => {
      const where = "incorrect =";
      const expressionSet: Array<Record<string, any>> = [
        {
          field: { name: "incorrect", type: "esriFieldTypeString" },
          values: [""],
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

    it("handles a malformatted clause with an AND", () => {
      const where = "incorrect = AND";
      const expressionSet: Array<Record<string, any>> = [
        {
          field: { name: "incorrect", type: "esriFieldTypeString" },
          values: [""],
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
  });
});
