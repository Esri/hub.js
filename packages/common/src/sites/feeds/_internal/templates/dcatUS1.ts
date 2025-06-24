export const DCAT_US_1X_DEFAULT = {
  title: "{{name}}",
  description: "{{description}}",
  keyword: "{{tags}}",
  issued: "{{created:toISO}}",
  modified: "{{modified:toISO}}",
  publisher: {
    name: "{{source}}",
  },
  contactPoint: {
    fn: "{{owner}}",
    hasEmail: "{{orgContactEmail}}",
  },
  spatial: "{{extent:computeSpatialProperty}}",
};
