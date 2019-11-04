const filterSchema: any = {
  orgId: {
    type: "filter",
    dataType: "string",
    defaultOp: "any",
    catalogDefinition: true
  },
  q: { type: "simple" },
  page: { type: "simple" },
  tags: {
    type: "filter",
    dataType: "string",
    defaultOp: "all"
  },
  source: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  },
  bbox: { type: "simple" },
  location_name: { type: "simple" },
  sort: { type: "simple" },
  groupIds: {
    type: "filter",
    dataType: "string",
    defaultOp: "any",
    catalogDefinition: true
  },
  catalog: { type: "simple" },
  owner: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  },
  access: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  },
  type: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  },
  hubType: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  },
  downloadable: {
    type: "filter",
    dataType: "boolean"
  },
  hasApi: {
    type: "filter",
    dataType: "boolean"
  },
  openData: {
    type: "filter",
    dataType: "boolean"
  },
  id: {
    type: "filter",
    dataType: "string",
    defaultOp: "any",
    catalogDefinition: true
  },
  collection: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  },
  sector: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  },
  region: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  },
  initiativeId: {
    type: "filter",
    dataType: "string",
    defaultOp: "any",
    catalogDefinition: true
  },
  categories: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  },
  license: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  },
  modified: {
    type: "filter",
    dataType: "string",
    defaultOp: "between"
  }
};

export { filterSchema };
