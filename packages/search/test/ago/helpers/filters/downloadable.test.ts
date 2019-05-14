import { downloadableFilter } from "../../../../src/ago/helpers/filters/downloadable";

describe("downloadable filter test", () => {
  it("downlodable filter should return correct type and typekeywords filter ago string", () => {
    const queryFilters: any = {
      downloadable: {
        terms: ["true"]
      }
    };
    const expected =
      '(type:"360 VR Experience" OR type:"Application" OR type:"CityEngine Web Scene" OR type:"Code Sample" OR type:"CSV Collection" OR type:"CSV" OR type:"CAD Drawing" OR type:"Desktop Application" OR type:"Desktop Application Template" OR type:"Desktop Style" OR type:"File Geodatabase" OR type:"GeoJson" OR type:"Geoprocessing Package" OR type:"Geoprocessing Sample" OR type:"Image" OR type:"iWork Keynote" OR type:"iWork Numbers" OR type:"KML Collection" OR type:"KML" OR type:"Layer" OR type:"Layer File" OR type:"Layer Package" OR type:"Layout" OR type:"Locator Package" OR type:"Map Package" OR type:"Map Service Definition" OR type:"Map Template" OR type:"Microsoft Excel" OR type:"Microsoft Powerpoint" OR type:"Microsoft Visio" OR type:"Microsoft Word" OR type:"Operations Dashboard Add In" OR type:"PDF" OR type:"Pro Map" OR type:"Project Package" OR type:"Project Template" OR type:"Raster function template" OR type:"Rule Package" OR type:"Service Definition" OR type:"Shapefile" OR type:"Vector Tile Package" OR type:"Workflow Manager Package" OR typekeywords:"Data")';
    expect(downloadableFilter(queryFilters)).toBe(expected);
  });

  it("downlodable filter should return correct type and typekeywords filter ago string when terms is false", () => {
    const queryFilters: any = {
      downloadable: {
        terms: ["false"]
      }
    };
    const expected =
      '(-type:"360 VR Experience" OR -type:"Application" OR -type:"CityEngine Web Scene" OR -type:"Code Sample" OR -type:"CSV Collection" OR -type:"CSV" OR -type:"CAD Drawing" OR -type:"Desktop Application" OR -type:"Desktop Application Template" OR -type:"Desktop Style" OR -type:"File Geodatabase" OR -type:"GeoJson" OR -type:"Geoprocessing Package" OR -type:"Geoprocessing Sample" OR -type:"Image" OR -type:"iWork Keynote" OR -type:"iWork Numbers" OR -type:"KML Collection" OR -type:"KML" OR -type:"Layer" OR -type:"Layer File" OR -type:"Layer Package" OR -type:"Layout" OR -type:"Locator Package" OR -type:"Map Package" OR -type:"Map Service Definition" OR -type:"Map Template" OR -type:"Microsoft Excel" OR -type:"Microsoft Powerpoint" OR -type:"Microsoft Visio" OR -type:"Microsoft Word" OR -type:"Operations Dashboard Add In" OR -type:"PDF" OR -type:"Pro Map" OR -type:"Project Package" OR -type:"Project Template" OR -type:"Raster function template" OR -type:"Rule Package" OR -type:"Service Definition" OR -type:"Shapefile" OR -type:"Vector Tile Package" OR -type:"Workflow Manager Package" OR -typekeywords:"Data")';
    expect(downloadableFilter(queryFilters)).toBe(expected);
  });

  it("downlodable filter should handle blank query filters", () => {
    const queryFilters: any = {};
    const expected =
      '(-type:"360 VR Experience" OR -type:"Application" OR -type:"CityEngine Web Scene" OR -type:"Code Sample" OR -type:"CSV Collection" OR -type:"CSV" OR -type:"CAD Drawing" OR -type:"Desktop Application" OR -type:"Desktop Application Template" OR -type:"Desktop Style" OR -type:"File Geodatabase" OR -type:"GeoJson" OR -type:"Geoprocessing Package" OR -type:"Geoprocessing Sample" OR -type:"Image" OR -type:"iWork Keynote" OR -type:"iWork Numbers" OR -type:"KML Collection" OR -type:"KML" OR -type:"Layer" OR -type:"Layer File" OR -type:"Layer Package" OR -type:"Layout" OR -type:"Locator Package" OR -type:"Map Package" OR -type:"Map Service Definition" OR -type:"Map Template" OR -type:"Microsoft Excel" OR -type:"Microsoft Powerpoint" OR -type:"Microsoft Visio" OR -type:"Microsoft Word" OR -type:"Operations Dashboard Add In" OR -type:"PDF" OR -type:"Pro Map" OR -type:"Project Package" OR -type:"Project Template" OR -type:"Raster function template" OR -type:"Rule Package" OR -type:"Service Definition" OR -type:"Shapefile" OR -type:"Vector Tile Package" OR -type:"Workflow Manager Package" OR -typekeywords:"Data")';
    expect(downloadableFilter(queryFilters)).toBe(expected);
  });
});
