/**
 * Interface for an Aggregation returned from search request,
 * where label is a value for a fieldname type for which aggregations were requested
 * and aggValue is the aggregation value
 */
interface IAggregation {
  label: string | number;
  aggValue: number;
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
 * A function used when to merge the same aggregation across multiple aggregation sources.
 * Implementations can handle summation of two aggregation values (as with COUNT and SUM),
 * but can also handle MIN/MAX
 */
type mergeFunc = (aggValueOne: number, aggValueTwo: number) => number;

/**
 * Alias types helpful for readability when processing list of aggregations results
 */
type AggregationMap = Record<string, number>;
type AggregationResultMap = Record<string, AggregationMap>;

/**
 * The default merge function for merging aggregations. Simply sums the aggregations
 * @param aggValueOne the value of one aggregatiom
 * @param aggValueTwo the value of the second aggregation
 * @returns the sum of the two values
 */
const defaultMergeFunc = (aggValueOne: number, aggValueTwo: number) => {
  return aggValueOne + aggValueTwo;
};

/**
 * Function to merge multiple aggregations results from different result sets. Explicitly assumed
 * that sets can contain overlapping aggregations that should be merged. Also explicitly assumed
 * that they contain aggregation values that are undefined or null (0 is valid),
 * and/or contain entire aggregation result sets that are empty or falsey
 *
 * @param aggs a list of aggregation result sets from different requests/sources
 * @param mergeFunction a merge function used to merge aggregation values across result sets
 * @returns a list of merged aggregations
 */
export function mergeAggregations(
  aggs: IAggregationResult[][] = [],
  mergeFunction: mergeFunc = defaultMergeFunc
): IAggregationResult[] {
  if (!Array.isArray(aggs) || aggs.length === 0) {
    return [];
  }

  const mergedMap: AggregationResultMap = aggs.reduce(
    (mergedAggs: AggregationResultMap, aggResultList: IAggregationResult[]) => {
      _addAggResultsToMap(mergedAggs, aggResultList, mergeFunction);
      return mergedAggs;
    },
    {} as AggregationResultMap
  );

  return _convertMapToResult(mergedMap);
}

function _addAggResultsToMap(
  mergedAggs: AggregationResultMap,
  aggResultList: IAggregationResult[],
  mergeFunction: mergeFunc
): AggregationResultMap {
  aggResultList.forEach((aggResult: IAggregationResult) => {
    if (!mergedAggs[aggResult.fieldName]) {
      _addNewAggFieldToMap(mergedAggs, aggResult);
    } else {
      _combineMapAndResult(
        mergedAggs[aggResult.fieldName],
        aggResult,
        mergeFunction
      );
    }
  });

  return mergedAggs;
}

function _addNewAggFieldToMap(
  mergedAggs: AggregationResultMap,
  aggResult: IAggregationResult
): AggregationResultMap {
  mergedAggs[aggResult.fieldName] = _convertAggsToMap(aggResult.aggregations);
  return mergedAggs;
}

function _combineMapAndResult(
  aggFieldMap: AggregationMap,
  aggResult: IAggregationResult,
  mergeFunction: mergeFunc
): AggregationMap {
  if (!aggResult || !aggResult.aggregations) {
    return aggFieldMap;
  }

  aggResult.aggregations.forEach((agg: IAggregation) => {
    if (agg.aggValue !== undefined && agg.aggValue !== null) {
      aggFieldMap[agg.label] = aggFieldMap[agg.label]
        ? mergeFunction(aggFieldMap[agg.label], agg.aggValue)
        : agg.aggValue;
    }
  });

  return aggFieldMap;
}

function _convertAggsToMap(aggregations: IAggregation[]): AggregationMap {
  if (!aggregations) {
    return {};
  }

  return aggregations.reduce(
    (aggLabelValueMap: AggregationMap, agg: IAggregation) => {
      if (agg.aggValue !== undefined && agg.aggValue !== null) {
        aggLabelValueMap[agg.label] = agg.aggValue;
      }
      return aggLabelValueMap;
    },
    {} as AggregationMap
  );
}

function _convertMapToResult(
  mergedMap: AggregationResultMap
): IAggregationResult[] {
  return Object.keys(mergedMap).map(fieldName => {
    const aggregations: IAggregation[] = Object.keys(mergedMap[fieldName]).map(
      (name: string) => {
        return {
          label: name,
          aggValue: mergedMap[fieldName][name]
        };
      }
    );

    return {
      fieldName,
      aggregations
    };
  });
}
