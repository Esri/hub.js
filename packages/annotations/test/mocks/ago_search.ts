import { ISearchResult } from "@esri/arcgis-rest-items";

export const annoSearchResponse: ISearchResult = {
  query: "hubAnnotationLayer AND orgid:5bc",
  total: 1,
  start: 1,
  num: 10,
  nextStart: -1,
  results: [
    {
      id: "abc123",
      owner: "c@sey",
      created: 1526675011000,
      modified: 1526675614000,
      guid: null,
      name: "Hub Annotations",
      title: "Hub Annotations",
      type: "Feature Service",
      typeKeywords: [
        "ArcGIS Server",
        "Data",
        "Feature Access",
        "Feature Service",
        "hubAnnotationLayer",
        "Service",
        "Singlelayer",
        "Hosted Service"
      ],
      description:
        "Feature service for Hub annotations. DO NOT DELETE THIS SERVICE. It stores the public annotations (comments) for all Hub items in your organization.",
      tags: [],
      snippet: "Feature service for Hub annotations",
      thumbnail: "thumbnail/ago_downloaded.png",
      documentation: null,
      extent: [
        [-8589300.590117617, 4692777.9712402625],
        [-8562027.314873265, 4722244.554455302]
      ],
      categories: [],
      spatialReference: null,
      accessInformation: null,
      licenseInfo: null,
      culture: null,
      properties: null,
      url:
        "https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/Hub Annotations/FeatureServer",
      proxyFilter: null,
      access: "public",
      size: -1,
      appCategories: [],
      industries: [],
      languages: [],
      largeThumbnail: null,
      banner: null,
      screenshots: [],
      listed: false,
      numComments: 0,
      numRatings: 0,
      avgRating: 0,
      numViews: 2,
      scoreCompleteness: 51,
      groupDesignations: null,
      protected: false
    }
  ]
};

export const emptyAnnoSearchResponse: ISearchResult = {
  query: "hubAnnotationLayer AND orgid:h7c",
  total: 1,
  start: 1,
  num: 10,
  nextStart: -1,
  results: []
};
