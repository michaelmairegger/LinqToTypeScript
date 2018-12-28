/**
 * Paritions the Iterable<T> into a tuple of failing and passing arrays
 * based on the predicate.
 * @param source Elements to Partition
 * @param predicate Pass / Fail condition
 * @returns [pass, fail]
 */
export declare const partition: <TSource>(source: Iterable<TSource>, predicate: (x: TSource) => boolean) => [TSource[], TSource[]];
