import { isNil } from "../../../../util";
import {
  ExpressionRelationships,
  IEntityInfo,
  IExpression,
  MetricSource,
} from "../../../types";
import { IConfigurationValues } from "../../types";
import {
  IMetric,
  IMetricCardParams,
  IMetricDisplayConfig,
} from "../../../types/Metrics";

/**
 * Transforms the arcgis-stat-card-editor values into an object with IMetric and IMetricDisplayConfig to be passed to the arcgis-hub-metric-card component.
 * @param values arcgis-configuration-editor values for the arcgis-hub-metric-card to use
 * @param metricName what should be the name of the transformed metric
 * @param metricId what should be the id of the transformed metric
 * @param entityInfo what should be the entityInfo of the transformed metric
 * @returns a metric and cardConfig used for rendering arcgis-hub-metric-card
 */
export function transformEditorValuesToMetricAndCardConfig(
  values: IConfigurationValues,
  metricId: string,
  opts?: { metricName?: string; entityInfo?: IEntityInfo }
): IMetricCardParams {
  const { value, dynamicMetric, ...config } = values;
  const {
    layerId,
    field,
    statistic,
    serviceUrl,
    fieldType,
    sourceLink,
    sourceTitle,
    allowExpressionSet,
    expressionSet,
    legacyWhere,
  } = dynamicMetric || {};
  const { entityInfo, metricName } = opts;

  // create source
  const source: MetricSource =
    values?.type === "dynamic"
      ? {
          type: "service-query",
          serviceUrl,
          layerId,
          field,
          statistic,
          where: legacyWhere
            ? legacyWhere
            : buildWhereClause(allowExpressionSet ? expressionSet : []),
        }
      : {
          type: "static-value",
          value,
        };

  // create metric
  const metric: IMetric = {
    source,
    name: metricName || metricId,
    entityInfo: entityInfo || {
      id: undefined,
      name: undefined,
      type: undefined,
    }, // ensure entity info has id, name, type
    id: metricId,
  };

  delete config.itemId;

  // create card config
  const displayConfig: IMetricDisplayConfig = {
    ...config,
    displayType: config.displayType || "stat-card",
    metricId,
    fieldType,
    statistic,
    // if we are in dynamic mode and have a link, then we use that link
    // otherwise we use manually input sourceLink on card config
    sourceLink:
      values?.type === "dynamic" && sourceLink
        ? sourceLink
        : config?.sourceLink,
    sourceTitle:
      values?.type === "dynamic" && sourceTitle
        ? sourceTitle
        : config?.sourceTitle,
    allowLink:
      values?.type === "dynamic" ? config.allowDynamicLink : config.allowLink,
  };

  return { metric, displayConfig };
}

/**
 * @param {Array} fields the available fields for a given dataset
 * @param {Object} values the selected values
 *
 * @returns {string} returns a string for the where clause query
 *
 * NOTE: currently returns string as a MATCH and everything else as BETWEEN
 */
export function buildWhereClause(expressionSet: IExpression[] = []): string {
  return (
    expressionSet
      .map((expression) => {
        const { field, values, relationship } = expression;

        const escape = (value: string) => value?.replace(/(['])/g, "$1$1"); // currently only handles single quotes

        // if we don't have values or field, or if it is an "incomplete" expression, do not include
        if (!values || !values.length || !field || !field?.name) {
          return false;
        }

        let clause;

        switch (field.type) {
          case "esriFieldTypeString":
            // used for migrating over the old "like" clauses
            clause =
              relationship === ExpressionRelationships.LIKE
                ? `${field.name} like '%${values[0]}%'`
                : `(${field.name} IN (${values
                    .map((value) => `'${escape(value as string)}'`)
                    .join(", ")}))`;
            break;

          case "esriFieldTypeDate":
            // if we have just one value for either value box
            if (!isNil(values[0])) {
              clause = `${field.name} >= timestamp '${escape(
                values[0] as string
              )} 00:00:00'`;
            } else if (!isNil(values[1])) {
              clause = `${field.name} <= timestamp '${escape(
                values[1] as string
              )} 23:59:59'`;
            }

            // if we have both, rewrite clause
            if (!isNil(values[0]) && !isNil(values[1])) {
              clause = `${field.name} >= timestamp '${escape(
                values[0] as string
              )} 00:00:00' AND ${field.name} <= timestamp '${escape(
                values[1] as string
              )} 23:59:59'`;
            }
            break;

          default:
            // if we have just one value for each value box
            if (!isNil(values[0])) {
              clause = `(${field.name}) >= ${values[0]}`;
            } else if (!isNil(values[1])) {
              clause = `(${field.name}) <= ${values[1]}`;
            }

            // if we have both, rewrite clause
            if (!isNil(values[0]) && !isNil(values[1])) {
              clause = `(${field.name}) >= ${values[0]} AND (${field.name}) <= ${values[1]}`;
            }
            break;
        }

        return clause;
      })
      .filter(Boolean)
      .join(" AND ") || "1=1"
  );
}
