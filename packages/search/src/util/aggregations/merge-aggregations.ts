/**
 * Interface for an Aggregation returned from search request,
 * where label is a value for a fieldname type for which aggregations were requested
 * and value is the aggregation value
 */
export interface IAggregation {
  label: string;
  value: number;
}

/**
 * Interface for an list of Aggregations requested for a particular fieldname
 * Ex. { fieldName: 'access', aggregations: [ { public: 2, private: 5, ... } ] }
 */
export interface IAggregationResult {
  fieldName: string;
  aggregations: IAggregation[];
}

/**
 * A function used to merge the same aggregation across multiple aggregation sources.
 * Implementations can handle summation of two aggregation values (as with COUNT and SUM),
 * but can also handle MIN/MAX
 */
type mergeFunc = (valueOne: number, valueTwo: number) => number;

/**
 * Alias types helpful for readability when processing list of aggregations results
 */
type AggregationMap = Record<string, number>;
type AggregationResultMap = Record<string, AggregationMap>;

/**
 * The default merge function for merging aggregations. Simply sums the aggregations
 * @param valueOne the value of one aggregatiom
 * @param valueTwo the value of the second aggregation
 * @returns the sum of the two values
 */
const sumAggregations = (valueOne: number, valueTwo: number) => {
  return valueOne + valueTwo;
};

/**
 * Function to merge multiple aggregations results from different result sets. Explicitly assumed
 * that sets can contain overlapping aggregations that should be merged. Also explicitly assumed
 * that they can contain aggregation values that are undefined or null (0 is valid),
 * and/or contain entire aggregation result sets that are empty or falsey
 *
 * @param aggs a list of aggregation result sets from different requests/sources
 * @param mergeFunction a merge function used to merge aggregation values across result sets
 * @returns a list of merged aggregations
 */
export function mergeAggregations(
  aggs: IAggregationResult[][] = [],
  mergeFunction: mergeFunc = sumAggregations
): IAggregationResult[] {
  if (!Array.isArray(aggs) || aggs.length === 0) {
    return [];
  }

  const aggResultMapList = aggs.map((aggResultList: IAggregationResult[]) =>
    _combineAggResultsToMap(aggResultList)
  );

  const mergedMap: AggregationResultMap = _createMergedMap(
    aggResultMapList,
    mergeFunction
  );

  return _convertMapToResult(mergedMap);
}

function _combineAggResultsToMap(
  aggResultList: IAggregationResult[]
): AggregationResultMap {
  return aggResultList.reduce(
    (aggResultMap: AggregationResultMap, aggResult: IAggregationResult) => {
      const aggMap = _createAggMap(aggResult);
      if (Object.keys(aggMap).length > 0) {
        const lowercasedFieldName = aggResult.fieldName.toLowerCase();
        aggResultMap[lowercasedFieldName] = aggMap;
      }
      return aggResultMap;
    },
    {} as AggregationResultMap
  );
}

function _createAggMap(aggResult: IAggregationResult): AggregationMap {
  const aggregations = aggResult.aggregations || [];
  return aggregations.reduce(
    (map: AggregationMap, agg: IAggregation) => {
      if (agg.value !== undefined && agg.value !== null) {
        const lowercasedLabel = agg.label.toLowerCase();
        map[lowercasedLabel] = agg.value;
      }
      return map;
    },
    {} as AggregationMap
  );
}

function _createMergedMap(
  aggResultMapList: AggregationResultMap[],
  mergeFunction: mergeFunc
): AggregationResultMap {
  return aggResultMapList.reduce(
    (mergedMap: AggregationResultMap, map: AggregationResultMap) => {
      Object.keys(map).forEach((fieldName: string) => {
        if (!mergedMap[fieldName]) {
          mergedMap[fieldName] = map[fieldName];
        } else {
          mergedMap[fieldName] = _mergeMaps(
            mergedMap[fieldName],
            map[fieldName],
            mergeFunction
          );
        }
      });
      return mergedMap;
    },
    {} as AggregationResultMap
  );
}

function _mergeMaps(
  existingMap: AggregationMap,
  newMap: AggregationMap,
  mergeFunction: mergeFunc
): AggregationMap {
  const mergedMap = Object.assign(existingMap);

  Object.keys(newMap).forEach((label: string) => {
    if (!mergedMap[label]) {
      mergedMap[label] = newMap[label];
    } else {
      mergedMap[label] = mergeFunction(existingMap[label], newMap[label]);
    }
  });

  return mergedMap;
}

function _convertMapToResult(
  mergedMap: AggregationResultMap
): IAggregationResult[] {
  return Object.keys(mergedMap).map(fieldName => {
    const aggregations: IAggregation[] = Object.keys(mergedMap[fieldName]).map(
      (name: string) => {
        return {
          label: name,
          value: mergedMap[fieldName][name]
        };
      }
    );

    return {
      fieldName,
      aggregations
    };
  });
}
