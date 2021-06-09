import { getItemMetadata } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "@esri/hub-common";

// options for fastXmlParser to read tag attrs
const parseOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_", // attr name will be a new field in the resulting json with this prefix
  textNodeName: "#value" // the resulting json will have field called #value pointing to the actual tag value,
};

/**
 * Fetch an [item's metadata](https://doc.arcgis.com/en/arcgis-online/manage-data/metadata.htm) from a portal
 * and parse and return it as JSON
 * @param id item id
 * @param requestOptions
 */
export function getContentMetadata(
  id: string,
  requestOptions?: IHubRequestOptions
): Promise<any> {
  return import("fast-xml-parser").then(parser => {
    return getItemMetadata(id, requestOptions).then(metadataXml => {
      return parser.parse(metadataXml, parseOptions);
    });
  });
}
