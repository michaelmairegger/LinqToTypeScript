/**
 * Returns the last element of a sequence.
 * If predicate is specified, the last element of a sequence that satisfies a specified condition.
 * @param source An Iterable<T> to return the last element of.
 * @param predicate A function to test each element for a condition. Optional.
 * @returns The value at the last position in the source sequence
 * or the last element in the sequence that passes the test in the specified predicate function.
 */
export declare function lastOrDefault<TSource>(source: Iterable<TSource>, predicate?: (x: TSource) => boolean): TSource | null;
