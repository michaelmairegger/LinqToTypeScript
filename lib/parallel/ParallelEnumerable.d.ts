import { IAsyncParallel, IComparer, IOrderedParallelEnumerable } from "../types";
import { toArray } from "./_private/toArray";
/**
 * Contains static methods to work with Parallel Async
 */
export { aggregate } from "./_private/aggregate";
export { all } from "./_private/all";
export { allAsync } from "./_private//allAsync";
export { empty } from "./_private/empty";
export { any } from "./_private/any";
export { anyAsync } from "./_private/anyAsync";
export { asAsync } from "./_private/asAsync";
export { average } from "./_private/average";
export { averageAsync } from "./_private/averageAsync";
export { concat } from "./_private/concat";
export { contains } from "./_private/contains";
export { containsAsync } from "./_private/containsAsync";
export { count } from "./_private/count";
export { countAsync } from "./_private/countAsync";
export { distinct } from "./_private/distinct";
export { distinctAsync } from "./_private/distinctAsync";
export { each } from "./_private/each";
export { eachAsync } from "./_private/eachAsync";
export { elementAt } from "./_private/elementAt";
export { elementAtOrDefault } from "./_private/elementAtOrDefault";
export { except } from "./_private/except";
export { exceptAsync } from "./_private/exceptAsync";
export { first } from "./_private/first";
export { firstAsync } from "./_private/firstAsync";
export { firstOrDefault } from "./_private/firstOrDefault";
export { firstOrDefaultAsync } from "./_private/firstOrDefaultAsync";
export { flatten } from "./_private/flatten";
export { from } from "./_private/from";
export { groupBy } from "./_private/groupBy";
export { groupByAsync } from "./_private/groupByAsync";
export { join } from "./_private/join";
export { intersect } from "./_private/intersect";
export { intersectAsync } from "./_private/intersectAsync";
export { last } from "./_private/last";
export { lastAsync } from "./_private/lastAsync";
export { lastOrDefault } from "./_private/lastOrDefault";
export { lastOrDefaultAsync } from "./_private/lastOrDefaultAsync";
export { max } from "./_private/max";
export { maxAsync } from "./_private/maxAsync";
export { min } from "./_private/min";
export { minAsync } from "./_private/minAsync";
export { select } from "./_private/select";
export { selectAsync } from "./_private/selectAsync";
export { selectMany } from "./_private/selectMany";
export { selectManyAsync } from "./_private/selectManyAsync";
export { ofType } from "./_private/ofType";
/**
 * Sorts the elements of a sequence in ascending order by using a specified or default comparer.
 * @param source A sequence of values to order.
 * @param keySelector A function to extract a key from an element.
 * @param comparer An IComparer<T> to compare keys. Optional.
 * @returns An IOrderedParallelEnumerable<TElement> whose elements are sorted according to a key.
 */
export declare function orderBy<TSource, TKey>(source: IAsyncParallel<TSource>, keySelector: (x: TSource) => TKey, comparer?: IComparer<TKey>): IOrderedParallelEnumerable<TSource>;
/**
 * Sorts the elements of a sequence in ascending order by using a specified comparer.
 * @param source A sequence of values to order.
 * @param keySelector An async function to extract a key from an element.
 * @param comparer An IComparer<T> to compare keys.
 * @returns An IOrderedParallelEnumerable<TElement> whose elements are sorted according to a key.
 */
export declare function orderByAsync<TSource, TKey>(source: IAsyncParallel<TSource>, keySelector: (x: TSource) => Promise<TKey>, comparer?: IComparer<TKey>): IOrderedParallelEnumerable<TSource>;
/**
 * Sorts the elements of a sequence in descending order by using a specified or default comparer.
 * @param source A sequence of values to order.
 * @param keySelector A function to extract a key from an element.
 * @param comparer An IComparer<T> to compare keys. Optional.
 * @return An IOrderedParallelEnumerable<TElement> whose elements are sorted in descending order according to a key.
 */
export declare function orderByDescending<TSource, TKey>(source: IAsyncParallel<TSource>, keySelector: (x: TSource) => TKey, comparer?: IComparer<TKey>): IOrderedParallelEnumerable<TSource>;
/**
 * Sorts the elements of a sequence in descending order by using a specified comparer.
 * @param source A sequence of values to order.
 * @param keySelector An async function to extract a key from an element.
 * @param comparer An IComparer<T> to compare keys.
 * @return An IOrderedParallelEnumerable<TElement> whose elements are sorted in descending order according to a key.
 */
export declare function orderByDescendingAsync<TSource, TKey>(source: IAsyncParallel<TSource>, keySelector: (x: TSource) => Promise<TKey>, comparer?: IComparer<TKey>): IOrderedParallelEnumerable<TSource>;
export { partition } from "./_private/partition";
export { partitionAsync } from "./_private/partitionAsync";
export { range } from "./_private/range";
export { repeat } from "./_private/repeat";
export { reverse } from "./_private/reverse";
export { sequenceEquals } from "./_private/sequenceEquals";
export { sequenceEqualsAsync } from "./_private/sequenceEqualsAsync";
export { single } from "./_private/single";
export { singleAsync } from "./_private/singleAsync";
export { singleOrDefault } from "./_private/singleOrDefault";
export { singleOrDefaultAsync } from "./_private/singleOrDefaultAsync";
export { skip } from "./_private/skip";
export { skipWhile } from "./_private/skipWhile";
export { skipWhileAsync } from "./_private/skipWhileAsync";
export { sum } from "./_private/sum";
export { sumAsync } from "./_private/sumAsync";
export { take } from "./_private/take";
export { takeWhile } from "./_private/takeWhile";
export { takeWhileAsync } from "./_private/takeWhileAsync";
export { toArray };
export { toMap } from "./_private/toMap";
export { toMapAsync } from "./_private/toMapAsync";
export { toObject } from "./_private/toObject";
export { toSet } from "./_private/toSet";
export { union } from "./_private/union";
export { unionAsync } from "./_private/unionAsync";
export { where } from "./_private/where";
export { whereAsync } from "./_private/whereAsync";
export { zip } from "./_private/zip";
export { zipAsync } from "./_private/zipAsync";
