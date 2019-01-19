import { IAsyncParallel, IParallelEnumerable } from "../../types";
/**
 * Returns elements from a sequence as long as a specified condition is true.
 * The element's index is used in the logic of the predicate function.
 * @param source The sequence to return elements from.
 * @param predicate An async function to test each source element for a condition;
 * the second parameter of the function represents the index of the source element.
 * @return An IParallelEnumerable<T> that contains elements
 * from the input sequence that occur before the element at which the test no longer passes.
 */
export declare function takeWhileAsync<TSource>(source: IAsyncParallel<TSource>, predicate: (x: TSource, index: number) => Promise<boolean>): IParallelEnumerable<TSource>;
