import { IParallelEnumerable } from "../../types";
/**
 * Generates a sequence that contains one repeated value.
 * @param element The value to be repeated.
 * @param count The number of times to repeat the value in the generated sequence.
 * @returns An IParallelEnumerable<T> that contains a repeated value.
 */
export declare function repeat<TResult>(element: TResult, count: number, delay?: number): IParallelEnumerable<TResult>;