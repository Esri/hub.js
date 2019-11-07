/**
 * Flatten categories as expected by Hub
 *
 * @param {any} categoriesAggs categories aggs array as [{ key, docCount }]
 * @returns {any}
 *
 * Input example:
 * [{ key: '/categories/economy', docCount: 4 }, { key: 'categories/economy/business', docCount: 5 }]
 * Output: [{ key: 'economy', docCount: 9 }, { key: 'business', docCount: 5 }]
 */
export function flattenCategories(categoriesAggs: any = []) {
  const set = new Set();
  const exclude = ["", "categories"];
  // 1. get a flattened unique set of categories
  categoriesAggs.forEach((agg: any) => {
    const candidates = agg.key
      .split("/")
      .filter((k: string) => exclude.indexOf(k) === -1);
    candidates.forEach((k: string) => {
      set.add(k);
    });
  });
  // 2. sum docCount for unique keys
  const flattenedCategoriesAggs = Array.from(set).reduce(
    (flattenedAggs: any, uniqueKey: any) => {
      const docCount = categoriesAggs
        .filter((agg: any) => agg.key.includes(uniqueKey))
        .map((agg: any) => agg.docCount)
        .reduce((x: number, y: number) => x + y);
      flattenedAggs.push({
        key: uniqueKey,
        docCount
      });
      return flattenedAggs;
    },
    []
  );
  return flattenedCategoriesAggs;
}
