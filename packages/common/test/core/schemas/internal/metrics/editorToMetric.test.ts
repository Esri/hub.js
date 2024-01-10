import {
  ExpressionRelationships,
  IExpression,
  IMetricEditorValues,
  IServiceQueryMetricSource,
  IStaticValueMetricSource,
  MetricVisibility,
} from "../../../../../src/core/types/Metrics";
import * as EditorToMetric from "../../../../../src/core/schemas/internal/metrics/editorToMetric";

import {
  MOCK_DATE_FIELD,
  MOCK_ID_FIELD,
  MOCK_NUMERIC_FIELD,
  MOCK_STRING_FIELD,
} from "./fixtures";
import { FieldType } from "@esri/arcgis-rest-types";

describe("editorToMetric", () => {
  describe("buildWhereClause", () => {
    it("constructs a where clause successfully", () => {
      const expressionSet: IExpression[] = [
        {
          field: MOCK_STRING_FIELD,
          key: "expression-123",
          values: ["value1"],
          relationship: ExpressionRelationships.IS_EXACTLY,
        },
        {
          field: MOCK_NUMERIC_FIELD,
          key: "expression-456",
          values: [0, 2],
          relationship: ExpressionRelationships.BETWEEN,
        },
        {
          field: MOCK_NUMERIC_FIELD,
          key: "expression-444",
          values: [undefined as any, 4],
          relationship: ExpressionRelationships.BETWEEN,
        },
        {
          field: MOCK_NUMERIC_FIELD,
          key: "expression-4445",
          values: [1, undefined as any],
          relationship: ExpressionRelationships.BETWEEN,
        },
        {
          field: MOCK_DATE_FIELD,
          key: "expression-777",
          values: [undefined as any, "2023-01-04"],
          relationship: ExpressionRelationships.BETWEEN,
        },
        {
          field: MOCK_DATE_FIELD,
          key: "expression-7778",
          values: ["2023-01-02", undefined as any],
          relationship: ExpressionRelationships.BETWEEN,
        },
        {
          field: MOCK_DATE_FIELD,
          key: "expression-789",
          values: ["2023-01-01", "2023-01-03"],
          relationship: ExpressionRelationships.BETWEEN,
        },

        {
          field: MOCK_ID_FIELD,
          key: "expression-000",
          values: ["1234", "5234"],
          relationship: ExpressionRelationships.BETWEEN,
        },
        {
          field: MOCK_STRING_FIELD,
          key: "expression-111",
          values: ["val"],
          relationship: ExpressionRelationships.LIKE,
        },
        {
          field: MOCK_STRING_FIELD,
          key: "expression-111",
          values: ["val", "e"],
          relationship: ExpressionRelationships.IS_EXACTLY,
        },
        {
          field: MOCK_STRING_FIELD,
          key: "expression-111",
          values: [],
          relationship: ExpressionRelationships.IS_EXACTLY,
        },
      ];
      const whereClause = EditorToMetric.buildWhereClause(expressionSet);
      expect(whereClause).toEqual(
        "(category%20IN%20('value1'))%20AND%20(amount)%20%3E%3D%200%20AND%20(amount)%20%3C%3D%202%20AND%20(amount)%20%3C%3D%204%20AND%20(amount)%20%3E%3D%201%20AND%20date%20%3C%3D%20timestamp%20'2023-01-04%2023%3A59%3A59'%20AND%20date%20%3E%3D%20timestamp%20'2023-01-02%2000%3A00%3A00'%20AND%20date%20%3E%3D%20timestamp%20'2023-01-01%2000%3A00%3A00'%20AND%20date%20%3C%3D%20timestamp%20'2023-01-03%2023%3A59%3A59'%20AND%20(guid)%20%3E%3D%201234%20AND%20(guid)%20%3C%3D%205234%20AND%20category%20like%20'%25val%25'%20AND%20(category%20IN%20('val'%2C%20'e'))"
      );
    });
    // NOTE THESE NEXT FIVE TESTS COVER CASES WHICH SHOULD NEVER OCCUR
    // BUT WHICH HAVE BEEN SEEN IN THE WILD. THE GOAL IS TO JUST ENSURE
    // AN EXCEPTION IS NOT THROWN. THE WHERE CLAUSE WILL BE INVALID, BUT
    // THE SITE WILL NOT CRASH
    it("handles object in values with between", () => {
      const expressionSet: IExpression[] = [
        {
          field: MOCK_DATE_FIELD,
          key: "expression-7890",
          values: [{} as unknown as string, "2023-01-03"],
          relationship: ExpressionRelationships.BETWEEN,
        },
      ];
      const whereClause = EditorToMetric.buildWhereClause(expressionSet);
      expect(whereClause).toEqual(
        "date%20%3C%3D%20timestamp%20'2023-01-03%2023%3A59%3A59'"
      );
    });
    it("handles objects in values with between", () => {
      const expressionSet: IExpression[] = [
        {
          field: MOCK_DATE_FIELD,
          key: "expression-7890",
          values: [{} as unknown as string, {} as unknown as string],
          relationship: ExpressionRelationships.BETWEEN,
        },
      ];
      const whereClause = EditorToMetric.buildWhereClause(expressionSet);
      expect(whereClause).toEqual("1%3D1");
    });
    it("handles bad strings in values with between", () => {
      const expressionSet: IExpression[] = [
        {
          field: MOCK_DATE_FIELD,
          key: "expression-7890",
          values: ["WAT", "BLARG"],
          relationship: ExpressionRelationships.BETWEEN,
        },
      ];
      const whereClause = EditorToMetric.buildWhereClause(expressionSet);
      expect(whereClause).toEqual(
        "date%20%3E%3D%20timestamp%20'WAT%2000%3A00%3A00'%20AND%20date%20%3C%3D%20timestamp%20'BLARG%2023%3A59%3A59'"
      );
    });
    it("handles single entry in values with between", () => {
      const expressionSet: IExpression[] = [
        {
          field: MOCK_DATE_FIELD,
          key: "expression-7890",
          values: ["2022-01-01"],
          relationship: ExpressionRelationships.BETWEEN,
        },
      ];
      const whereClause = EditorToMetric.buildWhereClause(expressionSet);
      expect(whereClause).toEqual(
        "date%20%3E%3D%20timestamp%20'2022-01-01%2000%3A00%3A00'"
      );
    });
    it("handles null in values with between", () => {
      const expressionSet: IExpression[] = [
        {
          field: MOCK_DATE_FIELD,
          key: "expression-7890",
          values: [null as unknown as string, "2022-01-01"],
          relationship: ExpressionRelationships.BETWEEN,
        },
      ];
      const whereClause = EditorToMetric.buildWhereClause(expressionSet);
      expect(whereClause).toEqual(
        "date%20%3C%3D%20timestamp%20'2022-01-01%2023%3A59%3A59'"
      );
    });
    // END
    it("handles an undefined expression set", () => {
      const whereClause = EditorToMetric.buildWhereClause(undefined);
      expect(whereClause).toEqual("1%3D1");
    });
  });

  describe("editorToMetric", () => {
    it("uses legacy where if we have it instead of building a where clause", () => {
      const values = {
        value: "1",
        type: "dynamic",
        dynamicMetric: {
          layerId: 0,
          field: "",
          statistic: "",
          serviceUrl: "",
          fieldType: "esriFieldTypeString" as FieldType,
          allowExpressionSet: true,
          expressionSet: [] as IExpression[],
          legacyWhere: "location = 'river' OR location = 'sun'",
        },
        itemId: "",
        displayType: "stat-card",
        metricId: "m123",
      };

      const opts = {
        metricName: "name",
      };

      const buildWhereClauseSpy = spyOn(EditorToMetric, "buildWhereClause");

      const { metric } = EditorToMetric.editorToMetric(values, "id", opts);
      const source = metric.source as IServiceQueryMetricSource;
      expect(source.where).toBe("location = 'river' OR location = 'sun'");
      expect(buildWhereClauseSpy).toHaveBeenCalledTimes(0);
    });
    it("handles an empty values object", () => {
      const values = undefined as any;
      const metricId = "test123";
      const opts = {};
      const { metric } = EditorToMetric.editorToMetric(values, metricId, opts);
      expect(metric.source as IStaticValueMetricSource as any).toEqual({
        type: "static-value",
        value: undefined,
        valueType: undefined,
      });
    });
    it("handles an empty values object", () => {
      const values = {} as unknown as IMetricEditorValues;
      const metricId = "test123";
      const opts = {};
      const { metric } = EditorToMetric.editorToMetric(values, metricId, opts);
      expect(metric.source as IStaticValueMetricSource as any).toEqual({
        type: "static-value",
        value: undefined,
        valueType: undefined,
      });
    });

    it("handles a values object with just value and dynamicMetric", () => {
      const values = {
        value: "",
        dynamicMetric: {},
      } as unknown as IMetricEditorValues;
      const metricId = "test123";
      const opts = {};
      const { metric } = EditorToMetric.editorToMetric(values, metricId, opts);
      expect(metric.source as IStaticValueMetricSource as any).toEqual({
        type: "static-value",
        value: "",
        valueType: undefined,
      });
    });
    it("creates a new where clause correctly", () => {
      const values = {
        value: "1",
        type: "dynamic",
        metricId: "id",
        displayType: "stat-card",
        dynamicMetric: {
          layerId: 0,
          field: "",
          statistic: "",
          serviceUrl: "",
          fieldType: "esriFieldTypeString" as FieldType,
          allowExpressionSet: true,
          expressionSet: [
            {
              field: MOCK_STRING_FIELD,
              key: "expression-123",
              values: ["value1"],
              relationship: ExpressionRelationships.IS_EXACTLY,
            },
            {
              field: MOCK_NUMERIC_FIELD,
              key: "expression-456",
              values: [0, 2],
              relationship: ExpressionRelationships.BETWEEN,
            },
            {
              field: MOCK_NUMERIC_FIELD,
              key: "expression-444",
              values: [undefined as any, 4],
              relationship: ExpressionRelationships.BETWEEN,
            },
            {
              field: MOCK_NUMERIC_FIELD,
              key: "expression-4445",
              values: [1, undefined as any],
              relationship: ExpressionRelationships.BETWEEN,
            },
            {
              field: MOCK_DATE_FIELD,
              key: "expression-777",
              values: [undefined as any, "2023-01-04"],
              relationship: ExpressionRelationships.BETWEEN,
            },
            {
              field: MOCK_DATE_FIELD,
              key: "expression-7778",
              values: ["2023-01-02", undefined as any],
              relationship: ExpressionRelationships.BETWEEN,
            },
            {
              field: MOCK_DATE_FIELD,
              key: "expression-789",
              values: ["2023-01-01", "2023-01-03"],
              relationship: ExpressionRelationships.BETWEEN,
            },
            {
              field: MOCK_ID_FIELD,
              key: "expression-000",
              values: ["1234", "5234"],
              relationship: ExpressionRelationships.BETWEEN,
            },
            {
              field: MOCK_STRING_FIELD,
              key: "expression-111",
              values: ["val"],
              relationship: ExpressionRelationships.LIKE,
            },
            {
              field: MOCK_STRING_FIELD,
              key: "expression-111",
              values: ["val", "e"],
              relationship: ExpressionRelationships.IS_EXACTLY,
            },
            {
              field: MOCK_STRING_FIELD,
              key: "expression-111",
              values: [],
              relationship: ExpressionRelationships.IS_EXACTLY,
            },
          ] as IExpression[],
        },
        itemId: "",
      };

      const buildWhereClauseSpy = spyOn(EditorToMetric, "buildWhereClause");

      const opts = {
        metricName: "name",
      };

      const { metric } = EditorToMetric.editorToMetric(values, "id", opts);
      const source = metric.source as IServiceQueryMetricSource;
      expect(source.where).toBe(
        "(category%20IN%20('value1'))%20AND%20(amount)%20%3E%3D%200%20AND%20(amount)%20%3C%3D%202%20AND%20(amount)%20%3C%3D%204%20AND%20(amount)%20%3E%3D%201%20AND%20date%20%3C%3D%20timestamp%20'2023-01-04%2023%3A59%3A59'%20AND%20date%20%3E%3D%20timestamp%20'2023-01-02%2000%3A00%3A00'%20AND%20date%20%3E%3D%20timestamp%20'2023-01-01%2000%3A00%3A00'%20AND%20date%20%3C%3D%20timestamp%20'2023-01-03%2023%3A59%3A59'%20AND%20(guid)%20%3E%3D%201234%20AND%20(guid)%20%3C%3D%205234%20AND%20category%20like%20'%25val%25'%20AND%20(category%20IN%20('val'%2C%20'e'))"
      );
      expect(buildWhereClauseSpy).toHaveBeenCalledTimes(0);
    });

    it("handles no legacy where with no allowed expression set", () => {
      const values = {
        dynamicMetric: {
          allowExpressionSet: false,
          expressionSet: [] as IExpression[],
        },
        type: "dynamic",
        metricId: "test123",
        displayType: "stat-card",
      };
      const metricId = "test123";
      const opts = {};
      const { metric } = EditorToMetric.editorToMetric(values, metricId, opts);
      expect(metric.source as IStaticValueMetricSource as any).toEqual({
        type: "service-query",
        serviceUrl: undefined,
        layerId: undefined,
        field: undefined,
        statistic: undefined,
        where: "1%3D1",
      });
    });

    describe("source link ", () => {
      it("handles dynamic source link correctly", () => {
        const values = {
          value: "1",
          type: "dynamic",
          displayType: "stat-card",
          sourceLink: "/staticmaps/123",
          sourceTitle: "StaticMaps123",
          allowLink: false,
          dynamicMetric: {
            layerId: 0,
            field: "",
            statistic: "",
            serviceUrl: "",
            fieldType: "esriFieldTypeString" as FieldType,
            sourceLink: "/dynamicmaps/123",
            sourceTitle: "DynamicMaps123",
            allowExpressionSet: true,
            expressionSet: [] as IExpression[],
            legacyWhere: "location = 'river' OR location = 'sun'",
          },
          itemId: "",
          metricId: "id",
        };

        const opts = {
          metricName: "name",
        };

        const { displayConfig } = EditorToMetric.editorToMetric(
          values,
          "id",
          opts
        );
        expect(displayConfig).toEqual({
          displayType: "stat-card",
          metricId: "id",
          type: "dynamic",
          sourceLink: "/dynamicmaps/123",
          sourceTitle: "DynamicMaps123",
          allowLink: undefined,
          fieldType: "esriFieldTypeString",
          visibility: MetricVisibility.hidden,
          statistic: "",
          itemId: undefined,
          expressionSet: [],
          allowExpressionSet: true,
        });
      });
      it("handles static source link correctly", () => {
        const values = {
          value: "1",
          type: "dynamic",
          displayType: "stat-card",
          sourceLink: "/staticmaps/123",
          sourceTitle: "StaticMaps123",
          allowLink: false,
          dynamicMetric: {
            layerId: 0,
            field: "",
            statistic: "",
            serviceUrl: "",
            fieldType: "esriFieldTypeString" as FieldType,
            sourceLink: "/dynamicmaps/123",
            sourceTitle: "DynamicMaps123",
            allowDynamicLink: true,
            allowExpressionSet: true,
            expressionSet: [] as IExpression[],
            legacyWhere: "location = 'river' OR location = 'sun'",
          },
          itemId: "",
          metricId: "id",
        };

        const opts = {
          metricName: "name",
        };

        const { displayConfig } = EditorToMetric.editorToMetric(
          values,
          "id",
          opts
        );
        expect(displayConfig).toEqual({
          displayType: "stat-card",
          metricId: "id",
          type: "dynamic",
          sourceLink: "/dynamicmaps/123",
          sourceTitle: "DynamicMaps123",
          allowLink: undefined,
          fieldType: "esriFieldTypeString",
          statistic: "",
          visibility: MetricVisibility.hidden,
          itemId: undefined,
          expressionSet: [],
          allowExpressionSet: true,
        });
      });
      it("handles static source link correctly when no source", () => {
        const values = {
          value: "1",
          type: "dynamic",
          displayType: "stat-card",
          allowLink: false,
          dynamicMetric: {
            layerId: 0,
            field: "",
            statistic: "",
            serviceUrl: "",
            fieldType: "esriFieldTypeString" as FieldType,
            sourceLink: "/dynamicmaps/123",
            sourceTitle: "DynamicMaps123",
            allowDynamicLink: true,
            allowExpressionSet: true,
            expressionSet: [] as IExpression[],
            legacyWhere: "location = 'river' OR location = 'sun'",
          },
          itemId: "",
          metricId: "id",
        };

        const opts = {
          metricName: "name",
        };

        const { displayConfig } = EditorToMetric.editorToMetric(
          values,
          "id",
          opts
        );
        expect(displayConfig).toEqual({
          displayType: "stat-card",
          metricId: "id",
          type: "dynamic",
          sourceLink: "/dynamicmaps/123",
          sourceTitle: "DynamicMaps123",
          allowLink: undefined,
          fieldType: "esriFieldTypeString",
          statistic: "",
          visibility: MetricVisibility.hidden,
          itemId: undefined,
          expressionSet: [],
          allowExpressionSet: true,
        });
      });
      it("handles static source link correctly when no source or entity info", () => {
        const values = {
          value: "1",
          type: "dynamic",
          displayType: "stat-card",
          allowLink: false,
          dynamicMetric: {
            layerId: 0,
            field: "",
            statistic: "",
            serviceUrl: "",
            fieldType: "esriFieldTypeString" as FieldType,
            sourceLink: "/dynamicmaps/123",
            sourceTitle: "DynamicMaps123",
            allowDynamicLink: true,
            allowExpressionSet: true,
            expressionSet: [] as IExpression[],
            legacyWhere: "location = 'river' OR location = 'sun'",
          },
          itemId: "",
          metricId: "id",
        };

        const { displayConfig } = EditorToMetric.editorToMetric(
          values,
          "id",
          undefined
        );
        expect(displayConfig).toEqual({
          displayType: "stat-card",
          metricId: "id",
          type: "dynamic",
          sourceLink: "/dynamicmaps/123",
          sourceTitle: "DynamicMaps123",
          allowLink: undefined,
          fieldType: "esriFieldTypeString",
          statistic: "",
          visibility: MetricVisibility.hidden,
          itemId: undefined,
          expressionSet: [],
          allowExpressionSet: true,
        });
      });
    });
  });
});
