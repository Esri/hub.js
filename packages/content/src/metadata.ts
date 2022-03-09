import { getItemMetadata } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "@esri/hub-common";
import { parse } from "fast-xml-parser";

function parseMetadataXml(metadataXml: string): any {
  const opts = {
    // options for fastXmlParser to read tag attrs
    ignoreAttributes: false,
    attributeNamePrefix: "@_", // attr name will be a new field in the resulting json with this prefix
    textNodeName: "#value", // the resulting json will have field called #value pointing to the actual tag value,
  };
  return parse(metadataXml, opts);
}

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
  return getItemMetadata(id, requestOptions).then((metadataXml) =>
    parseMetadataXml(metadataXml)
  );
}
