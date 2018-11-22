import { IEnumerable, IOrderedAsyncEnumerable, IOrderedEnumerable, IParallelEnumerable } from "../types";
import { IAsyncEnumerable } from "./../async/async";
import { IAsyncEqualityComparer, IComparer, IEqualityComparer, IGrouping, InferType, OfType } from "./../shared/shared";
/**
 * Array backed Enumerable
 */
export declare class ArrayEnumerable<TSource> extends Array<TSource> implements IEnumerable<TSource> {
    aggregate(func: (x: TSource, y: TSource) => TSource): TSource;
    aggregate<TAccumulate>(seed: TAccumulate, func: (x: TAccumulate, y: TSource) => TAccumulate): TAccumulate;
    aggregate<TAccumulate, TResult>(seed: TAccumulate, func: (x: TAccumulate, y: TSource) => TAccumulate, resultSelector: (x: TAccumulate) => TResult): TSource;
    all(predicate: (x: TSource) => boolean): boolean;
    allAsync(predicate: (x: TSource) => Promise<boolean>): Promise<boolean>;
    any(predicate?: (x: TSource) => boolean): boolean;
    anyAsync(predicate: (x: TSource) => Promise<boolean>): Promise<boolean>;
    asAsync(): IAsyncEnumerable<TSource>;
    asParallel(): IParallelEnumerable<TSource>;
    average(this: IEnumerable<number>): number;
    average(selector: (x: TSource) => number): number;
    averageAsync(selector: (x: TSource) => Promise<number>): Promise<number>;
    concat(items: IEnumerable<TSource>): IEnumerable<TSource>;
    concat(...items: Array<ReadonlyArray<TSource>>): ArrayEnumerable<TSource>;
    concat(...items: Array<TSource | ReadonlyArray<TSource>>): ArrayEnumerable<TSource>;
    contains(value: TSource, comparer?: IEqualityComparer<TSource>): boolean;
    containsAsync(value: TSource, comparer: IAsyncEqualityComparer<TSource>): Promise<boolean>;
    count(): number;
    count(predicate: (x: TSource) => boolean): number;
    countAsync(predicate: (x: TSource) => Promise<boolean>): Promise<number>;
    distinct(comparer?: IEqualityComparer<TSource>): IEnumerable<TSource>;
    distinctAsync(comparer: IAsyncEqualityComparer<TSource>): IAsyncEnumerable<TSource>;
    elementAt(index: number): TSource;
    elementAtOrDefault(index: number): TSource | null;
    except(second: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): IEnumerable<TSource>;
    exceptAsync(second: Iterable<TSource>, comparer: IAsyncEqualityComparer<TSource>): IAsyncEnumerable<TSource>;
    first(predicate?: (x: TSource) => boolean): TSource;
    firstAsync(predicate: (x: TSource) => Promise<boolean>): Promise<TSource>;
    firstOrDefault(): TSource | null;
    firstOrDefault(predicate: (x: TSource) => boolean): TSource | null;
    firstOrDefaultAsync(predicate: (x: TSource) => Promise<boolean>): Promise<TSource | null>;
    each(action: (x: TSource) => void): IEnumerable<TSource>;
    eachAsync(action: (x: TSource) => Promise<void>): IAsyncEnumerable<TSource>;
    groupBy(keySelector: (x: TSource) => number): IEnumerable<IGrouping<number, TSource>>;
    groupBy(keySelector: (x: TSource) => string): IEnumerable<IGrouping<string, TSource>>;
    groupBy<TKey>(keySelector: (x: TSource) => TKey, comparer: IEqualityComparer<TKey>): IEnumerable<IGrouping<TKey, TSource>>;
    groupByAsync<TKey>(keySelector: (x: TSource) => TKey | Promise<TKey>, comparer?: IEqualityComparer<TKey> | IAsyncEqualityComparer<TKey>): IAsyncEnumerable<IGrouping<TKey, TSource>>;
    groupByWithSel<TElement>(keySelector: ((x: TSource) => number), elementSelector: (x: TSource) => TElement): IEnumerable<IGrouping<number, TElement>>;
    groupByWithSel<TElement>(keySelector: ((x: TSource) => string), elementSelector: (x: TSource) => TElement): IEnumerable<IGrouping<string, TElement>>;
    groupByWithSel<TKey, TElement>(keySelector: ((x: TSource) => TKey), elementSelector: (x: TSource) => TElement, comparer: IEqualityComparer<TKey>): IEnumerable<IGrouping<TKey, TElement>>;
    intersect(second: IEnumerable<TSource>, comparer?: IEqualityComparer<TSource>): IEnumerable<TSource>;
    intersectAsync(second: IEnumerable<TSource>, comparer: IAsyncEqualityComparer<TSource>): IAsyncEnumerable<TSource>;
    joinByKey<TInner, TKey, TResult>(inner: IEnumerable<TInner>, outerKeySelector: (x: TSource) => TKey, innerKeySelector: (x: TInner) => TKey, resultSelector: (x: TSource, y: TInner) => TResult, comparer?: IEqualityComparer<TKey>): IEnumerable<TResult>;
    last(predicate?: (x: TSource) => boolean): TSource;
    lastAsync(predicate: (x: TSource) => Promise<boolean>): Promise<TSource>;
    lastOrDefault(predicate?: (x: TSource) => boolean): TSource | null;
    lastOrDefaultAsync(predicate: (x: TSource) => Promise<boolean>): Promise<TSource | null>;
    max(this: IEnumerable<number>): number | never;
    max(selector: (x: TSource) => number): number | never;
    maxAsync(selector: (x: TSource) => Promise<number>): Promise<number | never>;
    min(this: IEnumerable<number>): number | never;
    min(selector: (x: TSource) => number): number | never;
    minAsync(selector: (x: TSource) => Promise<number>): Promise<number | never>;
    ofType<TType extends OfType>(type: TType): IEnumerable<InferType<TType>>;
    orderBy<TKey>(predicate: (x: TSource) => TKey, comparer?: IComparer<TKey>): IOrderedEnumerable<TSource>;
    orderByAsync<TKey>(predicate: (x: TSource) => Promise<TKey>, comparer?: IComparer<TKey>): IOrderedAsyncEnumerable<TSource>;
    orderByDescending<TKey>(predicate: (x: TSource) => TKey, comparer?: IComparer<TKey>): IOrderedEnumerable<TSource>;
    orderByDescendingAsync<TKey>(predicate: (x: TSource) => Promise<TKey>, comparer?: IComparer<TKey>): IOrderedAsyncEnumerable<TSource>;
    reverse(): ArrayEnumerable<TSource>;
    select<OUT>(selector: (x: TSource) => OUT): IEnumerable<OUT>;
    select<TKey extends keyof TSource>(this: IEnumerable<{
        [key: string]: TSource[TKey];
    }>, selector: TKey): IEnumerable<TSource[TKey]>;
    selectAsync<OUT>(selector: (x: TSource) => OUT): IAsyncEnumerable<OUT>;
    selectAsync<TKey extends keyof TSource, TResult>(this: IEnumerable<{
        [key: string]: Promise<TResult>;
    }>, selector: TKey): IAsyncEnumerable<TResult>;
    selectMany<TBindedSource extends {
        [key: string]: Iterable<TOut>;
    }, TOut>(this: IEnumerable<TBindedSource>, selector: keyof TBindedSource): IEnumerable<TOut>;
    selectMany<OUT>(selector: (x: TSource) => Iterable<OUT>): IEnumerable<OUT>;
    selectManyAsync<OUT>(selector: (x: TSource) => Promise<Iterable<OUT>>): IAsyncEnumerable<OUT>;
    sequenceEquals(second: IEnumerable<TSource>, comparer?: IEqualityComparer<TSource>): boolean;
    sequenceEqualsAsync(second: IEnumerable<TSource>, comparer: IAsyncEqualityComparer<TSource>): Promise<boolean>;
    single(predicate?: (x: TSource) => boolean): TSource;
    singleAsync(predicate: (x: TSource) => Promise<boolean>): Promise<TSource>;
    singleOrDefault(predicate?: (x: TSource) => boolean): TSource | null;
    singleOrDefaultAsync(predicate: (x: TSource) => Promise<boolean>): Promise<TSource | null>;
    skip(count: number): IEnumerable<TSource>;
    skipWhile(predicate: (x: TSource, index: number) => boolean): IEnumerable<TSource>;
    skipWhileAsync(predicate: (x: TSource, index: number) => Promise<boolean>): IAsyncEnumerable<TSource>;
    sum(this: IEnumerable<number>): number;
    sum(selector: (x: TSource) => number): number;
    sumAsync(selector: (x: TSource) => Promise<number>): Promise<number>;
    take(amount: number): IEnumerable<TSource>;
    takeWhile(predicate: (x: TSource, index: number) => boolean): IEnumerable<TSource>;
    takeWhileAsync(predicate: (x: TSource, index: number) => Promise<boolean>): IAsyncEnumerable<TSource>;
    toArray(): TSource[];
    toMap<TKey>(selector: (x: TSource) => TKey): Map<TKey, TSource[]>;
    toMapAsync<TKey>(selector: (x: TSource) => Promise<TKey>): Promise<Map<TKey, TSource[]>>;
    toSet(): Set<TSource>;
    union(second: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): IEnumerable<TSource>;
    unionAsync(second: Iterable<TSource>, comparer: IAsyncEqualityComparer<TSource>): IAsyncEnumerable<TSource>;
    where(predicate: (x: TSource, index: number) => boolean): IEnumerable<TSource>;
    whereAsync(predicate: (x: TSource, index: number) => Promise<boolean>): IAsyncEnumerable<TSource>;
    zip<TSecond>(second: Iterable<TSecond>): IEnumerable<[TSource, TSecond]>;
    zip<TSecond, TResult>(second: Iterable<TSecond>, resultSelector: (x: TSource, y: TSecond) => TResult): IEnumerable<TResult>;
    zipAsync<TSecond, TResult>(second: Iterable<TSecond>, resultSelector: (x: TSource, y: TSecond) => Promise<TResult>): IAsyncEnumerable<TResult>;
}
