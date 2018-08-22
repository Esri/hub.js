/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { getProp, cloneObject } from "@esri/hub-common";
import { IInitiativeModel } from "@esri/hub-common";

export function upgradeToTwoDotZero(
  model: IInitiativeModel,
  portalUrl?: string
): IInitiativeModel {
  const curVersion = getProp(model, "item.properties.schemaVersion");
  if (curVersion < 2) {
    const clone = cloneObject(model) as IInitiativeModel;
    // store the schemaVersion
    clone.item.properties.schemaVersion = 2.0;
    // convert the values and values.steps into data.steps
    clone.data.steps = convertSteps(clone.data.values.steps, clone.data.values);
    if (clone.data.values.steps) {
      // remove the data.values.steps properties
      clone.data.values.steps.forEach((propName: string) => {
        delete clone.data.values[propName];
      });
      delete clone.data.values.steps;
    }
    // convert the indicators
    clone.data.indicators = convertInitiativeIndicators(clone.data.values);
    return clone;
  } else {
    return model;
  }
}

/**
 * Given the Indicators entry from a CAS configurationSettings array,
 * convert to an indicators object in the new schema
 */
export const convertIndicatorsToDefinitions = function(indicatorsHash: any) {
  // the incoming structure should have a .fields property, and what we want will be in there...
  if (!indicatorsHash.fields || !Array.isArray(indicatorsHash.fields)) {
    indicatorsHash.fields = [];
  }
  const defs = indicatorsHash.fields.map(convertIndicatorToDefinition);
  // now we need to create an object which has props for each def
  return defs;
};

/**
 * Convert a CAS formatted indicator to the .definition in the new schama
 */
export const convertIndicatorToDefinition = function(ind: any) {
  const def = {
    id: ind.fieldName,
    type: "Data",
    name: ind.label || ind.fieldName,
    optional: ind.optional || false,
    definition: {
      description: ind.label || ind.fieldName,
      supportedTypes: [...ind.layerOptions.supportedTypes],
      geometryTypes: [...ind.layerOptions.geometryTypes],
      fields: ind.fields.map(convertIndicatorField)
    }
  };
  return def;
};

/**
 * Convert the CAS formatted "field" into the new schema
 */
export const convertIndicatorField = function(field: any) {
  return {
    id: field.fieldName,
    name: field.label,
    optional: field.optional || false,
    description: field.tooltip,
    supportedTypes: [...field.supportedTypes]
  };
};

/**
 * Given the values hash that contains indicators, extract them
 * convert them, and return the indicators hash
 */
export const convertInitiativeIndicators = function(values: any) {
  return extractIndicators(values).map(convertIndicator);
};

/**
 * Convert the "source" information
 */
export const convertIndicator = function(indicator: any) {
  const result = {
    id: indicator.id,
    type: "Data",
    name: indicator.name || indicator.id,
    definition: {
      description: indicator.name || indicator.id
    },
    source: convertIndicatorValueToSource(indicator)
  };
  return result;
};
/**
 * Given the values hash, locate the properties that are Indicators
 * and return an array of cloned objects
 */
export const extractIndicators = function(values: any) {
  return Object.keys(values).reduce((acc, prop) => {
    const obj = values[prop];
    if (isIndicator(obj)) {
      const clone = cloneObject(obj);
      // we want to keep the prop name as the id
      clone.id = prop;
      acc.push(clone);
    }
    return acc;
  }, []);
};

/**
 * Given an object, conduct checks to see if it is an indicator
 */
export const isIndicator = function(obj: any) {
  let result = false;
  if (Array.isArray(obj.fields) && obj.fields.length > 0) {
    result = true;
  }
  return result;
};

/**
 * Given the indicator value object (from the Initiative), extract
 * the properties to create the .source hash
 */
export const convertIndicatorValueToSource = function(indicator: any) {
  return {
    type: "Feature Layer",
    url: indicator.url,
    itemId: indicator.itemId,
    layerId: indicator.layerId,
    name: indicator.name || indicator.id,
    mappings: indicator.fields.map(flattenField)
  };
};

/**
 * CAS format had the field properties nested but
 * the new format is flattened
 */
export const flattenField = function(field: any) {
  return {
    id: field.id,
    name: field.field.name,
    alias: field.field.alias,
    type: field.field.type
  };
};
/**
 * given the array of steps (prop names), construct an array
 * of the actual step objects while also falttening templates
 * and items arrays to just ids
 */
export const convertSteps = function(steps: any, values: any) {
  if (steps && Array.isArray(steps)) {
    return steps.map(stepName => {
      return convertStep(values[stepName]);
    });
  } else {
    return [];
  }
};

/**
 * Given a Step object, return a new object with the
 * updated schema
 */
export const convertStep = function(step: any) {
  // can't use object spread b/c there are props we don't want to carry forward
  const templates = step.templates || [];
  const items = step.items || [];
  return {
    title: step.title,
    description: step.description,
    id: step.id, // needed so we can later flatten out of the array into an object graph. This will be the key in the graph
    templateIds: templates.map(byId),
    itemIds: items.map(byId)
  };
};

export const byId = function(entry: any) {
  return entry.id;
};
