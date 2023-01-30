import { IOgcAggregationsResponse } from "../../../../src/search/_internal/hubSearchItemsHelpers/interfaces";

export const ogcAggregationsResponse: IOgcAggregationsResponse = {
  aggregations: {
    aggregations: [
      {
        field: "access",
        aggregations: [
          {
            label: "public",
            value: 141,
          },
        ],
      },
      {
        field: "type",
        aggregations: [
          {
            label: "feature service",
            value: 128,
          },
          {
            label: "csv",
            value: 8,
          },
        ],
      },
    ],
  },
  timestamp: "2023-01-23T23:43:42.523Z",
  links: [
    {
      rel: "self",
      type: "application/json",
      title: "This document as JSON",
      href: "https://my-test-site.arcgis.com/api/search/v1/collections/all/aggregations",
    },
  ],
};
