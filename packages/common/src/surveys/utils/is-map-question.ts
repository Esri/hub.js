/**
 * Determines if the given question is a map question
 * @param {Object} question A question object
 * @returns {boolean}
 */
export const isMapQuestion = (question: any) => {
  const { type, maps = [] } = question;
  const types = [
    "esriQuestionTypeGeoPoint",
    "esriQuestionTypePolyline",
    "esriQuestionTypePolygon",
  ];
  const isType = types.includes(type);
  return isType && maps.length > 0;
};
