import type { IField } from "@esri/arcgis-rest-feature-service";

export const MOCK_STRING_FIELD: IField = {
  name: "category",
  type: "esriFieldTypeString",
};

export const MOCK_NUMERIC_FIELD: IField = {
  name: "amount",
  type: "esriFieldTypeDouble",
};

export const MOCK_DATE_FIELD: IField = {
  name: "date",
  type: "esriFieldTypeDate",
};

export const MOCK_ID_FIELD: IField = {
  name: "guid",
  type: "esriFieldTypeGUID",
};
