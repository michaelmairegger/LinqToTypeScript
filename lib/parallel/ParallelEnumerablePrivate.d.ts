import { IAsyncEqualityComparer, IAsyncParallel, IEqualityComparer, IGrouping, IParallelEnumerable, ITuple, TypedData } from "../types";
import { BasicParallelEnumerable } from "./BasicParallelEnumerable";
export declare function aggregate_1<TSource>(source: AsyncIterable<TSource>, func: (x: TSource, y: TSource) => TSource): Promise<TSource>;
export declare function aggregate_2<TSource, TAccumulate>(source: AsyncIterable<TSource>, seed: TAccumulate, func: (x: TAccumulate, y: TSource) => TAccumulate): Promise<TAccumulate>;
export declare function aggregate_3<TSource, TAccumulate, TResult>(source: AsyncIterable<TSource>, seed: TAccumulate, func: (x: TAccumulate, y: TSource) => TAccumulate, resultSelector: (x: TAccumulate) => TResult): Promise<TResult>;
export declare function average_1(source: IAsyncParallel<number>): Promise<number>;
export declare function average_2<TSource>(source: IAsyncParallel<TSource>, func: (x: TSource) => number): Promise<number>;
export declare function count_1<TSource>(source: IParallelEnumerable<TSource>): Promise<number>;
export declare function count_2<TSource>(source: IParallelEnumerable<TSource>, predicate: (x: TSource) => boolean): Promise<number>;
export declare function first_1<TSource>(source: IParallelEnumerable<TSource>): Promise<TSource>;
export declare function first_2<TSource>(source: IParallelEnumerable<TSource>, predicate: (x: TSource) => boolean): Promise<TSource>;
export declare function firstOrDefault_1<TSource>(source: IParallelEnumerable<TSource>): Promise<TSource | null>;
export declare function firstOrDefault_2<TSource>(source: IParallelEnumerable<TSource>, predicate: (x: TSource) => boolean): Promise<TSource | null>;
export declare function groupBy_0_Simple<TSource>(source: IAsyncParallel<TSource>, keySelector: ((x: TSource) => string) | ((x: TSource) => number)): IParallelEnumerable<IGrouping<string | number, TSource>>;
export declare function groupBy_0<TSource, TKey>(source: IAsyncParallel<TSource>, keySelector: (x: TSource) => TKey, comparer: IEqualityComparer<TKey>): IParallelEnumerable<IGrouping<TKey, TSource>>;
export declare function groupByAsync_0_Simple<TSource>(source: IAsyncParallel<TSource>, keySelector: (x: TSource) => Promise<string>): IParallelEnumerable<IGrouping<string | number, TSource>>;
export declare function groupByAsync_0<TSource, TKey>(source: IAsyncParallel<TSource>, keySelector: (x: TSource) => Promise<TKey> | TKey, comparer: IEqualityComparer<TKey> | IAsyncEqualityComparer<TKey>): IParallelEnumerable<IGrouping<TKey, TSource>>;
export declare function groupBy_1_Simple<TSource, TElement>(source: IAsyncParallel<TSource>, keySelector: (x: TSource) => string | number, elementSelector: (x: TSource) => TElement): IParallelEnumerable<IGrouping<string | number, TElement>>;
export declare function groupBy_1<TSource, TKey, TElement>(source: IAsyncParallel<TSource>, keySelector: (x: TSource) => TKey, elementSelector: (x: TSource) => TElement, comparer: IEqualityComparer<TKey>): IParallelEnumerable<IGrouping<TKey, TElement>>;
export declare function last_1<TSource>(source: IParallelEnumerable<TSource>): Promise<TSource>;
export declare function last_2<TSource>(source: IParallelEnumerable<TSource>, predicate: (x: TSource) => boolean): Promise<TSource>;
export declare function lastOrDefault_1<TSource>(source: IParallelEnumerable<TSource>): Promise<TSource | null>;
export declare function lastOrDefault_2<TSource>(source: IParallelEnumerable<TSource>, predicate: (x: TSource) => boolean): Promise<TSource | null>;
export declare function repeat_1<T>(element: T, count: number): IParallelEnumerable<T>;
export declare function repeat_2<T>(element: T, count: number, delay: number): IParallelEnumerable<T>;
export declare function single_1<TSource>(source: IParallelEnumerable<TSource>): Promise<TSource>;
export declare function single_2<TSource>(source: IParallelEnumerable<TSource>, predicate: (x: TSource) => boolean): Promise<TSource>;
export declare function singleOrDefault_1<TSource>(source: IParallelEnumerable<TSource>): Promise<TSource | null>;
export declare function singleOrDefault_2<TSource>(source: IParallelEnumerable<TSource>, predicate: (x: TSource) => boolean): Promise<TSource | null>;
export declare function sum_1(source: IAsyncParallel<number>): Promise<number>;
export declare function sum_2<TSource>(source: IAsyncParallel<TSource>, selector: (x: TSource) => number): Promise<number>;
export declare function union_1<TSource>(first: IAsyncParallel<TSource>, second: IAsyncParallel<TSource>): BasicParallelEnumerable<TSource>;
export declare function union_2<TSource>(first: IAsyncParallel<TSource>, second: IAsyncParallel<TSource>, comparer: IEqualityComparer<TSource>): BasicParallelEnumerable<TSource>;
export declare function zip_1<T, Y>(source: IAsyncParallel<T>, second: IAsyncParallel<Y>): IParallelEnumerable<ITuple<T, Y>>;
export declare function zip_2<T, Y, OUT>(source: IAsyncParallel<T>, second: IAsyncParallel<Y>, resultSelector: (x: T, y: Y) => OUT): IParallelEnumerable<OUT>;
export declare function nextIterationAsync<TSource, TOut>(source: IParallelEnumerable<TSource>, onfulfilled: (x: TSource) => Promise<TOut>): TypedData<TOut>;
export declare function nextIteration<TSource, TOut>(source: IParallelEnumerable<TSource>, onfulfilled: (x: TSource) => TOut): TypedData<TOut>;
export declare function toArray<TSource>(source: IParallelEnumerable<TSource>): Promise<TSource[]>;
