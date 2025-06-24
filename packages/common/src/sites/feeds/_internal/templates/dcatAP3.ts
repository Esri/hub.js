export const DCAT_AP_3X_DEFAULT = {
  "@context": {
    "@version": 1.1,
    "@protected": true,
    adms: "http://www.w3.org/ns/adms#",
    cnt: "http://www.w3.org/2011/content#",
    dash: "http://datashapes.org/dash#",
    dcat: "http://www.w3.org/ns/dcat#",
    dcatap: "http://data.europa.eu/r5r/",
    "dcat-us": "http://data.resources.gov/ontology/dcat-us#",
    "dcat-us-shp": "http://data.resources.gov/shapes/dcat-us#",
    dcterms: "http://purl.org/dc/terms/",
    dqv: "http://www.w3.org/ns/dqv#",
    foaf: "http://xmlns.com/foaf/0.1/",
    gsp: "http://www.opengis.net/ont/geosparql#",
    locn: "http://www.w3.org/ns/locn#",
    odrs: "http://schema.theodi.org/odrs#",
    org: "http://www.w3c.org/ns/org#",
    owl: "http://www.w3.org/2002/07/owl#",
    prov: "http://www.w3.org/ns/prov#",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    schema: "http://schema.org/",
    sh: "http://www.w3.org/ns/shacl#",
    skos: "http://www.w3.org/2004/02/skos/core#",
    "sdmx-attribute": "http://purl.org/linked-data/sdmx/2009/attribute#",
    spdx: "http://spdx.org/rdf/terms#",
    vcard: "http://www.w3.org/2006/vcard/ns#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
    "adms:Identifier": {
      "@id": "adms:Identifier",
      "@context": {
        schemaAgency: "http://www.w3.org/ns/adms#schemaAgency",
        creator: {
          "@id": "dcterms:creator",
          "@type": "@id",
        },
        issued: {
          "@id": "dcterms:issued",
        },
        version: "http://purl.org/dc/terms/version",
        notation: "http://www.w3.org/2004/02/skos/core#notation",
      },
    },
  },
  "@id": "{{ https://www.arcgis.com/home/item.html?id={{ site-item-id }}",
  "@type": "dcat:Catalog",
  "dct:description": "{{ site-snippet }}",
  "dct:title": "{{ site-title }}",
  "dct:publisher": {
    "@type": "foaf:Agent",
    "foaf:name": "{{ org-name }}",
  },
  "dct:language": {
    "@id": "{{ site-culture || lang/ENG }}",
  },
  "dct:creator": {
    "@id": "{{ org-url }}",
    "@type": "foaf:Agent",
    "foaf:name": "{{ org-name }}",
  },
  "dct:spatial": {
    "@type": "dct:Location",
    "dct:bbox": "POLYGON(( {{ hub-site-extent || org-extent }} ))",
  },
  "foaf:homepage": "{{ custom-domain || hub-domain }}",
  "dcat:themeTaxonomy": "{{ custom-value }}", // can be added via feed editor
  "dcat:dataset": [
    {
      "@type": "dcat:Dataset",
      "@id": "{{ itemID }}",
      "dct:identifier": "{{ agol-item-url }}",
      "dct:landingPage": "{{ hub-content-url }}",
      "dct:title": "{{ title }}",
      "dct:description": "{{ description || snippet }}",
      "dcat:theme":
        "{{ metadata.themeKeys.thesaName.citOnlineRes.linkage || itemCategories }}",
      "dcat:keyword": "{{ metadata.themeKeys.keyword || tags }}",
      "dcatap:applicableLegislation":
        "{{ report.measResult.ConResult.conSpec.resTitle }}",
      "foaf:page": {
        "foaf:Document": "{{ metadata-url }}",
        "dct:title": "Source metadata",
        "@type": "foaf:Document",
      },
      "dcat:contactPoint": {
        "vcard:org":
          "{{ metadata.metadata.dataIdInfo.idPoC.rpOrgName || metadata.metadata.dataIdInfo.idCitation.citRespParty.rpOrgName || metadata.metadata.mdContact.rpOrgName || orgName || '' }}",
        "vcard:hasEmail":
          "{{  metadata.metadata.dataIdInfo.idPoC.rpCntInfo.cntAddress.eMailAdd || metadata.metadata.dataIdInfo.citRespParty.rpCntInfo.cntAddress.eMailAdd || metadata.metadata.mdContact.rpCntInfo.cntAddress.eMailAdd || orgContactEmail }}",
        "@id": "{{ ownerUri }}",
        "vcard:role":
          "{{ metadata.metadata.dataIdInfo.idPoC.role.RoleCd.@_value || metadata.metadata.dataIdInfo.idCitation.citRespParty.role.RoleCd.@_value }}",
        "vcard:URL":
          "{{ metadata.metadata.dataIdInfo.idPoC.rpCntInfo.cntOnlineRes.linkage  || metadata.metadata.dataIdInfo.citRespParty.rpCntInfo.cntOnlineRes.linkages }}",
        "@type": "vcard:Kind",
      },
      "dct:publisher": {
        "@type": "foaf:Agent",
        "foaf:org": "{{ data.attributes.orgName }}",
      },
      "dct:location": {
        "@type": "dcat:bbox",
        "@value":
          "data.attributes.metadata.dataIdInfo.dataExt.geoEle.GeoBndBox || item.extent",
      },
      "dct:accessRights": {
        "dct:rightsStatement":
          "{{ metadata.dataIdInfo.resConst.SecConsts.class.ClasscationCd.@_value }}",
      },
      "dcat:Relationship": {
        "dct:relation": {
          "dct:isPartOf": "{{ base-item-url }}",
        },
      },
      "dct:temporal": {
        "@type": "dcterms:PeriodOfTime",
        "dct:startDate": {
          "@type":
            "{{ data.attributes.metadata.metadata.dataIdInfo.dataExt.tempEle.TempExtent.exTemp.TM_Period.tmBegin }}",
        },
        "dct:endDate": {
          "@value":
            "{{ data.attributes.metadata.metadata.dataIdInfo.dataExt.tempEle.TempExtent.exTemp.TM_Period.tmEnd }}",
          "@type": "xsd:date",
        },
      },
      "dct:subject": "{{ data.attributes.categories }}",
      "dct:provenance": {
        "@type": "dct:ProvenanceStatement",
        "@label": {
          "@value": "{{ dataIdInfo.idCredit }}",
        },
      },
      "dct:issued": {
        "@value":
          "{{ metadata.metadata.dataIdInfo.idCitation.date.pubDate || metadata.metadata.dataIdInfo.idCitation.date.createDate || created }}",
        "@type": "xsd:dateTime",
      },
      "dct:modified": {
        "@value": "{{ modified }}",
        "@type": "xsd:dateTime",
      },
      "dct:Frequency": "{{ metadata.resMaint.maintFreq.@_value }}",
      "dct:language": {
        "@id": "{{ metadata.mdLang.countryCode.value “-” languageCode.value }}",
      },
      "dcat:distribution": [
        {
          "@type": "dcat:Distribution",
          "dcat:accessURL": {
            "@id": "{{ hub-about-page-url }}",
          },
          "dct:format": {
            "@id": "ftype/HTML",
          },
          "dct:description": "Web Page",
          "dct:title": "ArcGIS Hub Dataset",
          "dct:rights": "{{ metadata.resConst.Consts.useLimit }}",
          "dct:license":
            "{{ structuredLicense.URL || metadata.metadata.dataIdInfo.resConst.LegConsts.useConsts.RestrictCd.@_value == '005' ? resConst.LegConsts.useLimit : '' }}",
        },
        {
          "@type": "dcat:Distribution",
          "dcat:accessURL": {
            "@id": "{{ arcgis-item-url }}",
          },
          "dct:format": {
            "@id": "ftype/HTML",
          },
          "dct:description":
            "A data layer is used to access and display data in a map or scene. Layers support ready-to-use properties and settings of data services.",
          "dct:title": "ArcGIS Data Layer",
        },
        {
          "@type": "dcat:DataService",
          "dcat:endpointURL": {
            "@id": "{{ serverURL }}",
          },
          "dct:conformsTo": "GeoServices REST",
          "dct:title": "ArcGIS REST service",
        },
      ],
    },
  ],
};
