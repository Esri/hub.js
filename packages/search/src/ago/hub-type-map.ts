interface IHubTypeMap {
  [key: string]: string[];
}

const hubTypeMap: IHubTypeMap = {
  "Document Link": ["Document"],
  "Feature Service": ["Map"],
  "Feature Layer": ["Dataset", "Map"],
  Table: ["Dataset"],
  "Map Service": ["Map"],
  "Web Map": ["Map"],
  "Image Service": ["Map", "Dataset"],
  "Vector Tile Service": ["Map"],
  "Web Scene": ["Map"],
  "Scene Service": ["Map"],
  "Feature Collection": ["Dataset", "Map"],
  "Feature Collection Template": ["Other"],
  "Layer Package": ["Dataset"],
  "City Engine Web Scene": ["Map"],
  "Web Mapping Application": ["App"],
  "Explorer Add In": ["Other"],
  "Operations Dashboard Add In": ["App"],
  "Service Definition": ["Other"],
  "Mobile Map Package": ["Other"],
  "Map Package": ["Dataset"],
  "Layer Template": ["Other"],
  "Geoprocessing Service": ["Other"],
  "File Geodatabase": ["Dataset"],
  "CSV Collection": ["Dataset"],
  "Microsoft Excel": ["Dataset"],
  Shapefile: ["Dataset"],
  GeoJSON: ["Dataset", "Map"],
  "KML Collection": ["Dataset", "Map"],
  PDF: ["Document"],
  "Hub Initiative": ["Initiative"],
  "Hub Page": ["Page"],
  "Hub Site Application": ["Site"],
  "Code Sample": ["Document"],
  "CAD Drawing": ["Document"],
  "Desktop Application": ["Other"],
  "Desktop Application Template": ["Other"],
  "Desktop Style": ["Other"],
  "Geoprocessing Package": ["Other"],
  "Geoprocessing Sample": ["Other"],
  Image: ["Document"],
  "iWork Keynote": ["Document"],
  "iWork Numbers": ["Document"],
  "Layer File": ["Dataset"],
  Layout: ["Other"],
  "Locator Package": ["Other"],
  "Map Service Definition": ["Other"],
  "Map Template": ["Other"],
  "Microsoft Powerpoint": ["Document"],
  "Microsoft Visio": ["Document"],
  "Pro Map": ["Map"],
  "Project Package": ["Other"],
  "Project Template": ["Other"],
  "Raster Function Template": ["Other"],
  "Rule Package": ["Other"],
  "Vector Tile Package": ["Dataset"],
  "Workflow Manager Package": ["Other"],
  "360 VR Experience": ["App"],
  "Stream Service": ["Dataset"],
  "Application Configuration": ["Other"],
  "Map Service Layer": ["Map", "Dataset"],
  "Web Map Tile Service": ["Map", "Dataset"],
  "Web Map Service": ["Map", "Dataset"]
};

// create the 'reverse map' based on the original one
const reverseHubTypeMap = Object.keys(hubTypeMap).reduce(
  (map: any = {}, specificType: string) => {
    const hubTypes = hubTypeMap[specificType];
    hubTypes.forEach(t => {
      const type = t.toLowerCase();
      if (!map[type]) {
        map[type] = [specificType];
      } else {
        map[type].push(specificType);
      }
    });
    return map;
  },
  {}
);

const lowerHubTypeMap = Object.keys(hubTypeMap).reduce(
  (map: any = {}, type: string) => {
    map[type.toLowerCase()] = hubTypeMap[type];
    return map;
  },
  {}
);

/**
 * Hub type lookup
 *
 * @export
 * @param {string} type
 * @returns {string[]}
 */
function hubTypeLookup(type = "") {
  return lowerHubTypeMap[type.toLowerCase()] || [];
}

/**
 * @param {string} hubType - the 'hubType' that should be expanded into an array of
 *                           ArcGIS Online types
 *
 * @return {string[]} - an array of ArcGIS Online types that correspond to the hubType.
 *                      the array will be empty if the hubType does not exist
 */
function hubTypeExpansion(hubType = "") {
  return reverseHubTypeMap[hubType.toLowerCase()] || [];
}

export { hubTypeLookup, hubTypeExpansion };
