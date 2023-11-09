import {
  ExpressionRelationships,
  IExpression,
  IMetricEditorValues,
  IServiceQueryMetricSource,
  IStaticValueMetricSource,
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
        "(category IN ('value1')) AND (amount) >= 0 AND (amount) <= 2 AND (amount) <= 4 AND (amount) >= 1 AND date <= timestamp '2023-01-04 23:59:59' AND date >= timestamp '2023-01-02 00:00:00' AND date >= timestamp '2023-01-01 00:00:00' AND date <= timestamp '2023-01-03 23:59:59' AND (guid) >= 1234 AND (guid) <= 5234 AND category like '%val%' AND (category IN ('val', 'e'))"
      );
    });
    // NOTE THESE NEXT THREE TESTS COVER CASES WHICH SHOULD NEVER OCCUR
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
        "date >= timestamp 'undefined 00:00:00' AND date <= timestamp '2023-01-03 23:59:59'"
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
      expect(whereClause).toEqual(
        "date >= timestamp 'undefined 00:00:00' AND date <= timestamp 'undefined 23:59:59'"
      );
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
        "date >= timestamp 'WAT 00:00:00' AND date <= timestamp 'BLARG 23:59:59'"
      );
    });
    // END
    it("handles an undefined expression set", () => {
      const whereClause = EditorToMetric.buildWhereClause(undefined);
      expect(whereClause).toEqual("1=1");
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
        "(category IN ('value1')) AND (amount) >= 0 AND (amount) <= 2 AND (amount) <= 4 AND (amount) >= 1 AND date <= timestamp '2023-01-04 23:59:59' AND date >= timestamp '2023-01-02 00:00:00' AND date >= timestamp '2023-01-01 00:00:00' AND date <= timestamp '2023-01-03 23:59:59' AND (guid) >= 1234 AND (guid) <= 5234 AND category like '%val%' AND (category IN ('val', 'e'))"
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
        where: "1=1",
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
          statistic: "",
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
        });
      });
    });
  });
});
