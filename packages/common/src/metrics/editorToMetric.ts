/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { isNil } from "../util";
import {
  IMetric,
  IMetricDisplayConfig,
  MetricSource,
  ExpressionRelationships,
  IEntityInfo,
  IExpression,
  IMetricEditorValues,
  MetricVisibility,
} from "../core/types/Metrics";
import { ServiceAggregation } from "../core/types/DynamicValues";

/**
 * Transforms the IConfigurationValues into an object with IMetric and IMetricDisplayConfig to be saved on an entity or rendered in the ui.
 * @param values IConfigurationValues for the arcgis-hub-metric-card to use
 * @param metricId what should be the id of the transformed metric
 * @param entityInfo what should be the entityInfo of the transformed metric
 * @returns IMetricCardParams
 */
export function editorToMetric(
  values: IMetricEditorValues = {
    displayType: "stat-card",
    metricId: undefined,
  },
  metricId: string,
  opts?: { metricName?: string; entityInfo?: IEntityInfo }
): { metric: IMetric; displayConfig: IMetricDisplayConfig } {
  const { value, valueType, dynamicMetric, ...config } = values;
  const {
    layerId,
    itemId,
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
  const { entityInfo, metricName } = opts || {};

  // create source
  const source: MetricSource =
    values.type === "dynamic"
      ? {
          type: "service-query",
          serviceUrl,
          layerId,
          field,
          statistic: statistic as ServiceAggregation,
          where: legacyWhere
            ? legacyWhere
            : buildWhereClause(allowExpressionSet ? expressionSet : []),
        }
      : {
          type: "static-value",
          value,
          valueType,
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
    visibility: config.visibility || MetricVisibility.hidden,
    metricId,
    // dynamic metric values
    fieldType,
    itemId,
    expressionSet,
    allowExpressionSet,
    statistic,
    // if we are in dynamic mode and have a link, then we use that link
    // otherwise we use manually input sourceLink on card config
    sourceLink:
      values.type === "dynamic" && sourceLink ? sourceLink : config.sourceLink,
    sourceTitle:
      values.type === "dynamic" && sourceTitle
        ? sourceTitle
        : config.sourceTitle,
    allowLink:
      values.type === "dynamic" ? config.allowDynamicLink : config.allowLink,
    type: values.type,
  };

  return { metric, displayConfig };
}

/**
 * Constructs a where clause from a given expression set.
 *
 * @param {Array} fields the available fields for a given dataset
 * @param {Object} values the selected values
 *
 * @returns {string} returns a string for the where clause query
 *
 * NOTE: currently returns string as a MATCH and everything else as BETWEEN
 */
export function buildWhereClause(expressionSet: IExpression[] = []): string {
  const whereClause =
    expressionSet
      .map((expression) => {
        const { field, values, relationship } = expression;

        const escape = (value: string) => {
          // Ensure that the value has a .replace method
          // We encountered a case where the value was an empty object (unclear how this happened)
          // and it caused the site to go into an infinite loop and crash. This is a safeguard.
          return value.replace && value.replace(/(['])/g, "$1$1"); // currently only handles single quotes
        };

        // if we don't have values or field, or if it is an "incomplete" expression, do not include
        if (!values || !values.length || !field || !field.name) {
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
            // just the first bounding value
            if (typeof values[0] === "string") {
              clause = `${field.name} >= timestamp '${escape(
                values[0]
              )} 00:00:00'`;
            }

            // just the second bounding value
            if (typeof values[1] === "string") {
              clause = `${field.name} <= timestamp '${escape(
                values[1]
              )} 23:59:59'`;
            }

            // if we have both, rewrite clause
            if (
              typeof values[0] === "string" &&
              typeof values[1] === "string"
            ) {
              clause = `${field.name} >= timestamp '${escape(
                values[0]
              )} 00:00:00' AND ${field.name} <= timestamp '${escape(
                values[1]
              )} 23:59:59'`;
            }
            break;

          default:
            // just the first bounding value
            if (!isNil(values[0])) {
              clause = `(${field.name}) >= ${values[0]}`;
            }

            // just the second bounding value
            if (!isNil(values[1])) {
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
      .join(" AND ") || "1=1";

  return encodeURIComponent(whereClause);
}
