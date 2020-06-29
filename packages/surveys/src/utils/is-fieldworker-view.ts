import { IFeatureServiceItem } from "@esri/hub-common";

/**
 * Determines if the provided IFeatureServiceItem is a
 * Fieldworker View
 * @param {IFeatureServiceItem} featureServiceItem 
 * @returns {boolean}
 */
export const isFieldworkerView = (
  featureServiceItem: IFeatureServiceItem
): boolean => {
  const hasTypekeyword = (typeKeyword: string): boolean =>
    featureServiceItem.typeKeywords.indexOf(typeKeyword) > -1;

  // Survey123 only recently added the "FieldworkerView" typekeyword
  let isFieldworker = hasTypekeyword("FieldworkerView");

  // we should support previously created fieldworkers too
  if (!isFieldworker) {
    const hasExpectedTypeKeywords = ["Survey123", "Feature Service", "View Service"].every(hasTypekeyword);
    isFieldworker = hasExpectedTypeKeywords && !hasTypekeyword("StakeholderView");
  }

  return isFieldworker;
};
