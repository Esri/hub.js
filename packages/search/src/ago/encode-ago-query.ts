import { hubTypeExpansion } from "../common/hub-type-map";
import { IQueryObject } from "./create-q";

export function encodeAgoQuery(queryObject: IQueryObject) {
  const query: any = {
    q: null,
    start: calcStart(queryObject),
    num:
      queryObject && queryObject.page && queryObject.page.size
        ? queryObject.page.size
        : 10
  };
  // start with 'implicit' query filters
  // - '-access: public'
  const queryParts = ["-access:public", '-type:"code attachment"'];

  // build the potentially enourmous 'q' parameter
  if (queryObject.q) queryParts.push(queryObject.q);
  if (queryObject.filter) {
    queryParts.push(handleFilter(queryObject.filter));
  }
  if (queryParts.length > 0) {
    query.q = queryParts.join(" AND ");
  }

  if (queryObject.sort) {
    query.bbox = queryObject.bbox;
  }

  if (queryObject.sort) {
    query.sortField = queryObject.sort.field;
    query.sortOrder = queryObject.sort.order;
  }

  if (queryObject.countFields) {
    query.countFields = queryObject.countFields;
  }

  if (queryObject.countSize) {
    query.countSize = queryObject.countSize;
  }

  return query;
}

function handleFilter(queryFilters: any) {
  const catalogDefinition: any = [];
  const otherFilters: any = [];
  Object.keys(queryFilters).forEach(key => {
    let clause;
    if (isCustomFilter(key)) {
      clause = customFilters[key](queryFilters, key);
    } else {
      clause = buildFilter(queryFilters, key);
    }
    if (queryFilters[key].catalogDefinition) {
      catalogDefinition.push(clause);
    } else {
      otherFilters.push(clause);
    }
  });

  if (catalogDefinition.length) {
    const catalogClause = `(${catalogDefinition.join(" OR ")})`;
    if (otherFilters.length) {
      return `${catalogClause} AND (${otherFilters.join(" OR ")})`;
    } else {
      return catalogClause;
    }
  } else if (otherFilters.length) {
    return otherFilters.join(" AND ");
  } else {
    return "";
  }
}

function calcStart(queryObject: IQueryObject) {
  const defaultPageObject: { [key: string]: number } = {};
  const pageObject = queryObject.page || defaultPageObject;
  const page = pageObject.number || 1;
  const size = pageObject.size || 10;
  return 1 + (page - 1) * size;
}

function buildFilter(queryFilters: any, key: string) {
  const terms =
    queryFilters && queryFilters[key] && queryFilters[key].terms
      ? queryFilters[key].terms
      : [];
  const joinType =
    queryFilters && queryFilters[key] && queryFilters[key].fn
      ? queryFilters[key].fn
      : undefined;
  let filter = terms
    .map((term: string) => `${key}:"${term}"`)
    .join(agoJoin(joinType));
  if (joinType === "not") {
    // "not" filter means everything but not those given terms
    filter = `NOT ${filter}`;
  }
  return `(${filter})`;
}

// This function returns the AGO-translation for the query types
// 'any' -> ' OR '
// 'all' => ' AND '
// 'not' => ' NOT '
// ... more filters to come, like the ones below
// 'gt' => ...
// 'lt' => ...
// 'gte' => ...
// 'lte' => ...
// 'range' => ...
function agoJoin(joinType: string) {
  const key = joinType || "any";
  const joinMap: { [key: string]: string } = {
    any: " OR ",
    all: " AND ",
    not: " NOT "
  };
  return joinMap[key];
}

// custom filter functions
const customFilters: any = {
  downloadable,
  hasApi,
  groupIds,
  collection
};

function isCustomFilter(filter: any) {
  return Object.keys(customFilters).includes(filter);
}

function collection(queryFilters: any) {
  const categories =
    queryFilters && queryFilters.collection && queryFilters.collection.terms
      ? queryFilters.collection.terms
      : [];
  const types = categories.flatMap((c: any) => hubTypeExpansion(c) || []);
  const filter = types.map((type: string) => `type:"${type}"`).join(" OR ");
  return `(${filter})`;
}

function hasApi(queryFilters: any) {
  const hasApiTrue = (queryFilters &&
  queryFilters.hasApi &&
  queryFilters.hasApi.terms
    ? queryFilters.hasApi.terms
    : [])[0];
  let apiFilter;
  if (hasApiTrue) {
    apiFilter = apiTypes
      .map(type => {
        return `type:"${type}"`;
      })
      .join(" OR ");
  } else {
    apiFilter = apiTypes
      .map(type => {
        return `-type:"${type}"`;
      })
      .join(" OR ");
  }
  return `(${apiFilter})`;
}

// builds the filter for the 'downloadable' facet
function downloadable(queryFilters: any) {
  const downloadTrue = (queryFilters &&
  queryFilters.downloadable &&
  queryFilters.downloadable.terms
    ? queryFilters.downloadable.terms
    : [])[0];
  let downloadFilter: string[];
  let typeKeywordFilter;
  if (downloadTrue) {
    downloadFilter = downloadableTypes.map(type => {
      return `type:"${type}"`;
    });
    typeKeywordFilter = downloadableTypeKeywords.map(type => {
      return `typekeywords:"${type}"`;
    });
  } else {
    downloadFilter = downloadableTypes.map(type => {
      return `-type:"${type}"`;
    });
    typeKeywordFilter = downloadableTypeKeywords.map(type => {
      return `-typekeywords:"${type}"`;
    });
  }
  return `(${downloadFilter.concat(typeKeywordFilter).join(" OR ")})`;
}

// builds the groupIds filter
function groupIds(queryFilters: any) {
  const groups =
    queryFilters && queryFilters.groupIds && queryFilters.groupIds.terms
      ? queryFilters.groupIds.terms
      : [];
  const groupsFilter = groups
    .map((id: string) => {
      return `group:"${id}"`;
    })
    .join(" OR ");
  return `(${groupsFilter})`;
}

const apiTypes = ["Feature Service", "Map Service", "Image Service"];

const downloadableTypeKeywords = ["Data"];
// eligible types are listed here: http://doc.arcgis.com/en/arcgis-online/reference/supported-items.htm
const downloadableTypes = [
  "360 VR Experience",
  "Application",
  "CityEngine Web Scene",
  "Code Sample",
  "CSV Collection",
  "CSV",
  "CAD Drawing",
  "Desktop Application",
  "Desktop Application Template",
  "Desktop Style",
  "File Geodatabase",
  "GeoJson",
  "Geoprocessing Package",
  "Geoprocessing Sample",
  "Image",
  "iWork Keynote",
  "iWork Numbers",
  "KML Collection",
  "KML",
  "Layer",
  "Layer File",
  "Layer Package",
  "Layout",
  "Locator Package",
  "Map Package",
  "Map Service Definition",
  "Map Template",
  "Microsoft Excel",
  "Microsoft Powerpoint",
  "Microsoft Visio",
  "Microsoft Word",
  "Operations Dashboard Add In",
  "PDF",
  "Pro Map",
  "Project Package",
  "Project Template",
  "Raster function template",
  "Rule Package",
  "Service Definition",
  "Shapefile",
  "Vector Tile Package",
  "Workflow Manager Package"
];
