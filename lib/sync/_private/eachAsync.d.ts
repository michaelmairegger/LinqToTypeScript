import { IAsyncEnumerable } from "../../types";
/**
 * Performs a specified action on each element of the Iterable<TSource>
 * @param source The source to iterate
 * @param action The action to take an each element
 * @returns A new IEnumerable<T> that executes the action lazily as you iterate.
 */
export declare function eachAsync<TSource>(source: Iterable<TSource>, action: (x: TSource) => Promise<void>): IAsyncEnumerable<TSource>;
