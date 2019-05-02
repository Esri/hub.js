const filterSchema: any = {
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
  }
};

export { filterSchema };
