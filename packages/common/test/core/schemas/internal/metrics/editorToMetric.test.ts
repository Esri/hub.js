import { IServiceQueryMetricSource } from "../../../../../src/core/types/Metrics";
import * as EditorToMetric from "../../../../../src/core/schemas/internal/metrics/editorToMetric";

import {
  MOCK_DATE_FIELD,
  MOCK_ID_FIELD,
  MOCK_NUMERIC_FIELD,
  MOCK_STRING_FIELD,
} from "./fixtures";

describe("editorToMetric", () => {
  describe("buildWhereClause", () => {
    it("constructs a where clause successfully", () => {
      const expressionSet = [
        {
          field: MOCK_STRING_FIELD,
          key: "expression-123",
          values: ["value1"],
        },
        {
          field: MOCK_NUMERIC_FIELD,
          key: "expression-456",
          values: [0, 2],
        },
        {
          field: MOCK_DATE_FIELD,
          key: "expression-789",
          values: ["2023-01-01", "2023-01-03"],
        },
        {
          field: MOCK_ID_FIELD,
          key: "expression-000",
          values: ["1234", "5234"],
        },
      ];
      const whereClause = EditorToMetric.buildWhereClause(expressionSet);
      expect(whereClause).toEqual(
        "(category IN ('value1')) AND (amount) >= 0 AND (amount) <= 2 AND date >= timestamp '2023-01-01 00:00:00' AND date <= timestamp '2023-01-03 23:59:59' AND (guid) >= 1234 AND (guid) <= 5234"
      );
    });
  });

  describe("transformEditorValuesToMetricAndCardConfig", () => {
    it("uses legacy where if we have it instead of building a where clause", () => {
      const values = {
        value: "1",
        type: "dynamic",
        dynamicMetric: {
          layerId: 0,
          field: "",
          statistic: "",
          serviceUrl: "",
          fieldType: "",
          allowExpressionSet: true,
          expressionSet: [],
          legacyWhere: "location = 'river' OR location = 'sun'",
        },
        itemId: "",
      };

      const opts = {
        metricName: "name",
      };

      const buildWhereClauseSpy = spyOn(EditorToMetric, "buildWhereClause");

      const { metric } =
        EditorToMetric.transformEditorValuesToMetricAndCardConfig(
          values,
          "id",
          opts
        );
      const source = metric.source as IServiceQueryMetricSource;
      expect(source.where).toBe("location = 'river' OR location = 'sun'");
      expect(buildWhereClauseSpy).toHaveBeenCalledTimes(0);
    });
  });
});
