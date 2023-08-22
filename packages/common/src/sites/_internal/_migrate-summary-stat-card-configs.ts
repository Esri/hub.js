import { setProp, getProp } from "../../objects";
import { IModel, IDraft } from "../../types";
import { cloneObject, createId } from "../../util";
import { IField } from "@esri/arcgis-rest-feature-layer";
import { FieldType } from "@esri/arcgis-rest-types";
import { IExpression } from "../../core/types/Metrics";

/**
 * Reconfigure summary stat card properties to align with the
 * new web component card.
 * @private
 * @param {Object} model Site Model
 * @returns {Object}
 */
export function _migrateSummaryStatCardConfigs<T extends IModel | IDraft>(
  model: T
): T {
  // attempt migration for 1.7 schema version
  const migratedModel = _migrateSummaryStatSchemaVersion1_7(model);
  return migratedModel;
}

function _migrateSummaryStatSchemaVersion1_7<T extends IModel | IDraft>(
  model: T
): T {
  // do nothing if migration already applied
  if (getProp(model, "item.properties.schemaVersion") >= 1.7) return model;

  // apply migration
  const clone = cloneObject(model);
  clone.data.values.layout.sections.map((section: any) => ({
    ...section,
    rows: (section.rows || []).map((row: any) => ({
      ...row,
      cards: (row.cards || []).map((card: any) => {
        if (card.component.name === "summary-statistic-card") {
          const values = card.component.settings;
          const expressionSet = whereToExpressionSet(values.where);
          card.component.settings = {
            type: "dynamic",
            cardTitle: values.title,
            dynamicMetric: {
              itemId: [values.itemId],
              layerId: values.layerId?.toString(),
              field: values.statFieldName,
              fieldType: values.statFieldType,
              statistic: values.statType,
              serviceUrl: getServiceUrl(values.url),
              expressionSet,
              allowExpressionSet: !!expressionSet.length,
            },
            serverTimeout: values.timeout,
            textAlign: migrateTextAlign(values.statValueAlign),
            valueColor:
              values.statValueColor === null
                ? undefined
                : values.statValueColor,
            trailingText: values.trailingText,
            cardId: values.cardId || createId(),

            // did not exist on old stat card
            allowUnitFormatting: false,
            allowLink: false,
          };
        }
        return card;
      }),
    })),
  }));

  setProp("item.properties.schemaVersion", 1.7, clone);
  return clone;
}

function getServiceUrl(url: string) {
  let serviceUrl: string = url;

  // url has layer id at end
  if (url?.lastIndexOf("FeatureServer") > -1) {
    serviceUrl = url.slice(0, url.lastIndexOf("FeatureServer") + 13);

    // url has layer id at end
  } else if (url?.lastIndexOf("MapServer") > -1) {
    serviceUrl = url.slice(0, url.lastIndexOf("MapServer") + 9);
  }

  return serviceUrl;
}

function migrateTextAlign(align: string): string {
  switch (align) {
    case "center":
      return "center";
    case "right":
      return "end";
    case "left":
    default:
      return "start";
  }
}

/**
 * Takes a where clause from a summary statistic card and transforms it into
 * the new expression set array for usage in the new summary stat card.
 *
 * This is a brittle function to be used just for the migration of the <=1.6 of the summary stat card into
 * the 1.7 version of the summary stat card.
 * @param where A where clause as a string. Ex: "Category = 'abc' AND date <= TIMESTAMP '2023-01-01 00:00:00"
 * @returns IExpression[] expression set of the where clause, broken down into individual expressions
 */
function whereToExpressionSet(where: string): IExpression[] {
  let expressionSet: IExpression[] = [];
  if (where) {
    const whereClauses = where.split("AND"); // what happens if a user puts "AND" as the matching value?
    expressionSet = whereClauses
      .map((clause) => {
        let expression: IExpression;

        // could be number or date
        if (clause.includes(">=")) {
          const { fieldName, value } = handleClauseSplit(clause, ">=");
          let finalValue = value;
          let fieldType: FieldType;

          // handle date
          if (value.includes("TIMESTAMP")) {
            finalValue = handleDateInClause(value);
            fieldType = "esriFieldTypeDate";
          }

          expression = makeExpression(fieldName, fieldType, [finalValue]);
        }

        // could be number or date AND value is second in values array
        else if (clause.includes("<=")) {
          const { fieldName, value } = handleClauseSplit(clause, "<=");
          let finalValue = value;
          let fieldType: FieldType;

          // handle date
          if (value.includes("TIMESTAMP")) {
            finalValue = handleDateInClause(value);
            fieldType = "esriFieldTypeDate";
          }

          expression = makeExpression(fieldName, fieldType, [
            undefined,
            finalValue,
          ]);
        }

        // string match
        else if (clause.includes("=") && clause !== "1=1") {
          const { fieldName, value } = handleClauseSplit(clause, "=");
          const cleanedValue = removeQuotesAroundValue(value);
          expression = makeExpression(fieldName, "esriFieldTypeString", [
            cleanedValue,
          ]);
        }

        return expression;
      })
      .filter((ex) => !!ex);
  }
  return expressionSet;
}

/**
 * Splits a clause by a given parameter.
 * @param clause String to split into pieces
 * @param splitBy How to split the string
 * @returns The field name and value from the clause, split
 */
function handleClauseSplit(
  clause: string,
  splitBy: string
): { fieldName: string; value: string } {
  const pieces = clause.split(splitBy);

  const fieldName = pieces[0].trim();
  const value = pieces[1].trim();
  return { fieldName, value };
}

/**
 * Takes a piece of a where clause with a date in it, and extracts just the YYYY-MM-DD.
 * @param value - where clause piece with value
 * @returns YYYY-MM-DD as string
 */
function handleDateInClause(value: string): string {
  const dateAndTimePieces = value.split("'");
  const dateAndTime = dateAndTimePieces[1].trim();
  const date = dateAndTime.split(" ")[0].trim();
  return date;
}

/**
 * Makes an expression for the expression set.
 * @param fieldName Name of IField
 * @param fieldType Type of IField
 * @param values Values in clause
 * @returns IExpression to be used in an expression set.
 */
function makeExpression(
  fieldName: string,
  fieldType: FieldType | undefined,
  values: Array<string | number | Date>
): IExpression {
  const field = {
    name: fieldName,
  } as IField;
  if (fieldType) {
    field.type = fieldType;
  }
  const expression = {
    field,
    values,
  };
  return expression;
}

/**
 * Removes single quotes around a value. Used to remove the leading and trailing
 * single quotes around a string value for a where clause.
 * @param value string value with single quotes around it
 * @returns string value without leading or trailing single quotes
 */
function removeQuotesAroundValue(value: string) {
  return value.replace(/^\'+|\'+$/g, "");
}
