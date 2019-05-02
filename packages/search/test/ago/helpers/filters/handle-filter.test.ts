import { handleFilter } from "../../../../src/ago/helpers/filters/handle-filter";

describe("handleFilter test", () => {
  it("handles custom filters correctly", () => {
    const queryFilters: any = {
      hasApi: {
        terms: ["true"],
        fn: null
      },
      downloadable: {
        terms: ["false"],
        fn: null
      }
    };
    const expected =
      '(type:"Feature Service" OR type:"Map Service" OR type:"Image Service") AND (-type:"360 VR Experience" OR -type:"Application" OR -type:"CityEngine Web Scene" OR -type:"Code Sample" OR -type:"CSV Collection" OR -type:"CSV" OR -type:"CAD Drawing" OR -type:"Desktop Application" OR -type:"Desktop Application Template" OR -type:"Desktop Style" OR -type:"File Geodatabase" OR -type:"GeoJson" OR -type:"Geoprocessing Package" OR -type:"Geoprocessing Sample" OR -type:"Image" OR -type:"iWork Keynote" OR -type:"iWork Numbers" OR -type:"KML Collection" OR -type:"KML" OR -type:"Layer" OR -type:"Layer File" OR -type:"Layer Package" OR -type:"Layout" OR -type:"Locator Package" OR -type:"Map Package" OR -type:"Map Service Definition" OR -type:"Map Template" OR -type:"Microsoft Excel" OR -type:"Microsoft Powerpoint" OR -type:"Microsoft Visio" OR -type:"Microsoft Word" OR -type:"Operations Dashboard Add In" OR -type:"PDF" OR -type:"Pro Map" OR -type:"Project Package" OR -type:"Project Template" OR -type:"Raster function template" OR -type:"Rule Package" OR -type:"Service Definition" OR -type:"Shapefile" OR -type:"Vector Tile Package" OR -type:"Workflow Manager Package" OR -typekeywords:"Data")';
    const actual = handleFilter(queryFilters);
    expect(actual).toBe(expected);
  });

  it("handles non-custom filters correctly", () => {
    const queryFilters: any = {
      tags: {
        terms: ["a", "b"],
        fn: "all"
      },
      source: {
        terms: ["x", "y"],
        fn: "any"
      }
    };
    const expected = '(tags:"a" AND tags:"b") AND (source:"x" OR source:"y")';
    const actual = handleFilter(queryFilters);
    expect(actual).toBe(expected);
  });

  it("handles catalog filters correctly", () => {
    const queryFilters: any = {
      groupIds: {
        terms: ["a", "b"],
        fn: "any",
        catalogDefinition: true
      },
      id: {
        terms: ["x", "y"],
        fn: "any",
        catalogDefinition: true
      }
    };
    const expected = '((group:"a" OR group:"b") OR (id:"x" OR id:"y"))';
    const actual = handleFilter(queryFilters);
    expect(actual).toBe(expected);
  });

  it("handles multiple filters correctly", () => {
    const queryFilters: any = {
      groupIds: {
        terms: ["a", "b"],
        fn: "any",
        catalogDefinition: true
      },
      id: {
        terms: ["x", "y"],
        fn: "any",
        catalogDefinition: true
      },
      tags: {
        terms: ["a", "b"],
        fn: "all"
      },
      hasApi: {
        terms: ["true"],
        fn: null
      }
    };
    const expected =
      '((group:"a" OR group:"b") OR (id:"x" OR id:"y")) AND ((tags:"a" AND tags:"b") OR (type:"Feature Service" OR type:"Map Service" OR type:"Image Service"))';
    const actual = handleFilter(queryFilters);
    expect(actual).toBe(expected);
  });
});
