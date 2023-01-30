import { IOgcItemsResponse } from "../../../../src/search/_internal/hubSearchItemsHelpers/interfaces";

export const ogcItemsResponse: IOgcItemsResponse = {
  type: "FeatureCollection",
  features: [
    {
      id: "f4bcc",
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-121.11799999999793, 39.37030746927015],
            [-119.00899999999801, 39.37030746927015],
            [-119.00899999999801, 38.67499450446548],
            [-121.11799999999793, 38.67499450446548],
            [-121.11799999999793, 39.37030746927015],
          ],
        ],
      },
      properties: {
        id: "f4bcc",
        owner: "goku",
        created: 1611934478000,
        modified: 1671554653000,
        guid: null,
        name: "Training_Grounds",
        title: "training grounds",
        type: "Feature Service",
        typeKeywords: [],
        description: "Gotta get those reps in!",
        tags: [],
        snippet: "How else can I push past my limits?",
        thumbnail: "thumbnail/hub_thumbnail_1658341016537.png",
        documentation: null,
        extent: {
          type: "Polygon",
          coordinates: [
            [
              [-121.11799999999793, 39.37030746927015],
              [-119.00899999999801, 39.37030746927015],
              [-119.00899999999801, 38.67499450446548],
              [-121.11799999999793, 38.67499450446548],
              [-121.11799999999793, 39.37030746927015],
            ],
          ],
        },
        categories: [],
        spatialReference: "102100",
        url: "https://servicesqa.arcgis.com/Xj56SBi2udA78cC9/arcgis/rest/services/Training_Grounds/FeatureServer",
        access: "public",
      },
      time: null,
      links: [
        {
          rel: "self",
          type: "application/geo+json",
          title: "This document as GeoJSON",
          href: "https://foo-bar.com/api/search/v1/collections/datasets/items/f4bcc",
        },
        {
          rel: "collection",
          type: "application/json",
          title: "All",
          href: "https://foo-bar.com/api/search/v1/collections/all",
        },
      ],
    },
  ],
  timestamp: "2023-01-23T18:53:40.715Z",
  numberMatched: 2,
  numberReturned: 1,
  links: [
    {
      rel: "self",
      type: "application/geo+json",
      title: "This document as GeoJSON",
      href: "https://foo-bar.com/api/search/v1/collections/all/items",
    },
    {
      rel: "collection",
      type: "application/json",
      title: "All",
      href: "https://foo-bar.com/api/search/v1/collections/all",
    },
  ],
};

export const ogcItemsResponseWithNext: IOgcItemsResponse = {
  type: "FeatureCollection",
  features: [
    {
      id: "f4bcc",
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-121.11799999999793, 39.37030746927015],
            [-119.00899999999801, 39.37030746927015],
            [-119.00899999999801, 38.67499450446548],
            [-121.11799999999793, 38.67499450446548],
            [-121.11799999999793, 39.37030746927015],
          ],
        ],
      },
      properties: {
        id: "f4bcc",
        owner: "goku",
        created: 1611934478000,
        modified: 1671554653000,
        guid: null,
        name: "Training_Grounds",
        title: "training grounds",
        type: "Feature Service",
        typeKeywords: [],
        description: "Gotta get those reps in!",
        tags: [],
        snippet: "How else can I push past my limits?",
        thumbnail: "thumbnail/hub_thumbnail_1658341016537.png",
        documentation: null,
        extent: {
          type: "Polygon",
          coordinates: [
            [
              [-121.11799999999793, 39.37030746927015],
              [-119.00899999999801, 39.37030746927015],
              [-119.00899999999801, 38.67499450446548],
              [-121.11799999999793, 38.67499450446548],
              [-121.11799999999793, 39.37030746927015],
            ],
          ],
        },
        categories: [],
        spatialReference: "102100",
        url: "https://servicesqa.arcgis.com/Xj56SBi2udA78cC9/arcgis/rest/services/Training_Grounds/FeatureServer",
        access: "public",
      },
      time: null,
      links: [
        {
          rel: "self",
          type: "application/geo+json",
          title: "This document as GeoJSON",
          href: "https://foo-bar.com/api/search/v1/collections/datasets/items/f4bcc",
        },
        {
          rel: "collection",
          type: "application/json",
          title: "All",
          href: "https://foo-bar.com/api/search/v1/collections/all",
        },
      ],
    },
  ],
  timestamp: "2023-01-23T18:53:40.715Z",
  numberMatched: 2,
  numberReturned: 1,
  links: [
    {
      rel: "self",
      type: "application/geo+json",
      title: "This document as GeoJSON",
      href: "https://foo-bar.com/api/search/v1/collections/all/items",
    },
    {
      rel: "collection",
      type: "application/json",
      title: "All",
      href: "https://foo-bar.com/api/search/v1/collections/all",
    },
    {
      rel: "next",
      type: "application/geo+json",
      title: "items (next)",
      href: "https://foo-bar.com/api/search/v1/collections/all/items?limit=1&startindex=2",
    },
  ],
};
