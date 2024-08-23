import { parseDatasetId } from "@esri/hub-common";
import { IDiscussionParams } from "../../types";

/**
 * Utility that parses a discussion URI string into its component parts
 *
 * @export
 * @param {string} discussion A discussion URI
 * @return {string}
 */
export function parseDiscussionURI(discussion: string): IDiscussionParams {
  let url;
  try {
    url = new URL(discussion);
  } catch (e) {
    throw new Error(`Invalid URI: ${discussion}`);
  }
  const source = url.protocol.replace(":", "");
  const [, pathname] = discussion.split("://");
  const [type, identifier] = pathname.split("/");
  let id;
  let layer;
  if (identifier) {
    const { itemId, layerId } = parseDatasetId(identifier);
    [id, layer] = [itemId, layerId];
  }
  const searchParams = new URLSearchParams(url.search.replace("?", ""));
  const features =
    (searchParams.has("id") && searchParams.get("id").split(",")) || null;
  const attribute =
    (searchParams.has("attribute") && searchParams.get("attribute")) || null;
  return {
    source,
    type,
    id: id || null,
    layer: layer || null,
    features,
    attribute,
  };
}
