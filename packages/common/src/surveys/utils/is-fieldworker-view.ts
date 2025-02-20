import { IItem } from "@esri/arcgis-rest-portal";

/**
 * Determines if the provided Feature Service item is a
 * Fieldworker View
 * @param {IItem} featureServiceItem
 * @returns {boolean}
 */
export function isFieldworkerView(featureServiceItem: IItem): boolean {
  const hasTypekeyword = (typeKeyword: string): boolean =>
    featureServiceItem.typeKeywords.indexOf(typeKeyword) > -1;

  // Survey123 only recently added the "FieldworkerView" typekeyword
  let isFieldworker = hasTypekeyword("FieldworkerView");

  // we should support previously created fieldworkers too
  if (!isFieldworker) {
    const hasExpectedTypeKeywords = [
      "Survey123",
      "Feature Service",
      "View Service",
    ].every(hasTypekeyword);
    isFieldworker =
      hasExpectedTypeKeywords && !hasTypekeyword("StakeholderView");
  }

  return isFieldworker;
}
