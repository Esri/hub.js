const legalSortFields = [
  "title",
  "created",
  "type",
  "owner",
  "modified",
  "avgrating",
  "numratings",
  "numcomments",
  "numviews"
];

const hubSortFieldToAGOSortFieldMap: { [key: string]: string } = {
  name: "title"
};

export function getSortField(field: string): string {
  if (legalSortFields.indexOf(field) >= 0) {
    return field;
  } else if (field in hubSortFieldToAGOSortFieldMap) {
    return hubSortFieldToAGOSortFieldMap[field];
  }
}
