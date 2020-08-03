/**
 * Parse item ID and layer ID (if any) from dataset record ID
 *
 * @param datasetId Hub API dataset record id ({itemId}_{layerId} or {itemId})
 */
export function parseDatasetId(
  datasetId: string
): { itemId: string; layerId?: string } {
  const [itemId, layerId] = datasetId ? datasetId.split("_") : [];
  return { itemId, layerId };
}
