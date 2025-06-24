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
export const DCAT_US_3X_DEFAULT = {
  "dct:title": "{{ name}}",
  "dct:description": "{{ description}}",
  "dct:issued": {
    "@value":
      "{{ metadata.metadata.dataIdInfo.idCitation.date.pubDate:toISO || metadata.metadata.dataIdInfo.idCitation.date.createDate:toISO || created:toISO }}",
    "@type": "xsd:dateTime",
  },
};
