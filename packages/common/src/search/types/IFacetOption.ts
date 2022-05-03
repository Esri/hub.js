import { IHubContent } from "../..";
import { ICollection } from "./ICollection";
import { Filter, FilterType } from "./types";

// Facet Options shown in the UI

export interface IFacetOption {
  // Translated label for the option
  label: string;
  // Unique key, used for query params and telemetry
  key: string;
  // For aggregate based Facets, the count of entries in the index with this value
  count?: number;
  // is this option selected when the UI loads
  selected: boolean;
  // Filter to be applied when this option is selected
  filter?: Filter<FilterType>;

  filters?: Filter<FilterType>[];
}

// export interface IFilterBlock<T extends FilterType> {
//   filterType: T;
//   operation: "AND" | "OR";
//   filters: Filter<T>[];
// }

// export interface IHubApiSearchRequest {
//   q: IFilterBlock<FilterType>[];
//   options: IHubApiSearchOptions;
// }

// export interface IHubApiSearchResponse {
//   jsonapi: {
//     version: string;
//   };
//   meta: {
//     total: number;
//     num: number;
//     start: number;
//     next: number;
//     hasNext: boolean;
//     aggregations?: {
//       mode: string;
//       field: string;
//       values: { value: string; count: number }[];
//     };
//   };
//   data: {
//     type: string;
//     id: string;
//     attributes: IHubContent[];
//   }[];
// }

// // const storyMapFilterBlock: IFilterBlock<"item"> = {
// //   operation: "OR",
// //   filters: [
// //     {
// //       filterType: "item",
// //       type: "StoryMap"
// //     },
// //     {
// //       filterType: "item",
// //       type: "Web Mapping Application",
// //       typekeywords: "StoryMap"
// //     }
// //   ]
// // };

const col: ICollection = {
  label: "Apps",
  key: "apps",
  sortOption: {
    label: "Title",
    attribute: "title",
    order: "asc",
    defaultOrder: "asc",
  },
  // should this be an array? or just something stuffed into
  // the array of filter blocks?
  filter: {
    filterType: "item",
    group: ["3ef"],
  },
  facets: [
    {
      label: "Emeddable",
      key: "embeddable",
      display: "multi-select",
      operation: "OR",
      options: [
        {
          label: "Dashboards",
          key: "dashboards",
          selected: false,
          filters: [
            {
              filterType: "item",
              type: "Dashboard",
            },
            {
              filterType: "item",
              type: "Web Mapping Application",
              typekeywords: {
                not: ["Operations Dashboard"],
              },
            },
          ],
        },
        {
          label: "StoryMaps",
          key: "storymaps",
          selected: false,
          filters: [
            {
              filterType: "item",
              type: "StoryMap",
            },
            {
              filterType: "item",
              type: "Web Mapping Application",
              typekeywords: "StoryMap",
            },
          ],
        },
      ],
    },
  ],
};

// const thingToSerialize: IFilterDefinition<"item">[] =
// [
//   { // First Checked Facet for Dashboard
//     operation: "OR",
//     filters: [
//       {
//         filterType: "item",
//         type: "Dashboard",
//       },
//       {
//         filterType: "item",
//         type: "Web Mapping Application",
//         typekeywords: {
//           not: ["Operations Dashboard"],
//         },
//       },
//     ],
//   },
//   { // Second Checked Facet for StoryMaps
//     operation: "OR",
//     filters: [
//       {
//         filterType: "item",
//         type: "StoryMap",
//       },
//       {
//         filterType: "item",
//         type: "Web Mapping Application",
//         typekeywords: "StoryMap",
//       },
//     ],
//   },
//   { // Simple Term
//     operation: "OR",
//     filters: [
//       {
//         filterType: "item",
//         term: "water",
//       },
//     ],
//   },
// ];

// const blocks: IFilterDefinition<"item">[] = [
//   // These two should render the same query with the
//   // same results
//   {
//     operation: "AND",
//     filters: [
//       {
//         filterType: "item",
//         type: "Web Mapping Application",
//       },
//       {
//         filterType: "item",
//         typekeywords: "StoryMap",
//       },
//     ],
//   },
//   {
//     operation: "OR",
//     filters: [
//       {
//         filterType: "item",
//         type: "Web Mapping Application",
//         typekeywords: "StoryMap",
//       },
//     ],
//   },
// ];

// const colOld: ICollection = {
//   filter: {
//     filterType: "content",
//     group: ["3ef"],
//   },
//   facets: [
//     {
//       label: "Emeddable",
//       key: "embeddable",
//       display: "multi-select",
//       options: [
//         {
//           label: "Dashboards",
//           key: "dashboards",
//           selected: false,
//           filter: {
//             filterType: "content",
//             subFilters: [
//               {
//                 filterType: "content",
//                 type: "Dashboard",
//               },
//               {
//                 filterType: "content",
//                 type: "Web Mapping Application",
//                 typekeywords: {
//                   not: ["Operations Dashboard"],
//                 },
//               },
//             ],
//           },
//         },
//         {
//           label: "Dashboards",
//           key: "dashboards",
//           selected: false,
//           filter: {
//             filterType: "content",
//             subFilters: [
//               {
//                 filterType: "content",
//                 type: "StoryMap",
//               },
//               {
//                 filterType: "content",
//                 type: "Web Mapping Application",
//                 typekeywords: "StoryMap",
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
// };
