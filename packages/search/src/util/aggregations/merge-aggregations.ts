interface IAggregation {
  label: string | number;
  aggValue: number;
}

export interface IAggregationResult {
  fieldName: string;
  aggregations: IAggregation[];
}

type mergeFunc = (aggValueOne: number, aggValueTwo: number) => number;

type AggregationMap = Record<string, number>;
type AggregationResultMap = Record<string, AggregationMap>;

const defaultMergeFunc = (aggValueOne: number, aggValueTwo: number) =>
  (aggValueOne || 0) + (aggValueTwo || 0);

export function mergeAggregations(
  aggs: IAggregationResult[][] = [],
  mergeFunction: mergeFunc = defaultMergeFunc
): IAggregationResult[] {
  if (!Array.isArray(aggs) || aggs.length === 0) {
    return null;
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
    if (!aggFieldMap[agg.label]) {
      aggFieldMap[agg.label] = agg.aggValue;
    } else {
      aggFieldMap[agg.label] = mergeFunction(
        aggFieldMap[agg.label],
        agg.aggValue
      );
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
      aggLabelValueMap[agg.label] = agg.aggValue;
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
