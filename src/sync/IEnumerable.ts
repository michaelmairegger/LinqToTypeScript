import { IAsyncEnumerable } from "../async/async"
import { IComparer, IConstructor, IEqualityComparer, IGrouping, ITuple } from "../shared/shared"
import { IOrderedEnumerable } from "./IOrderedEnumerable"

export interface IEnumerable<TSource> extends Iterable<TSource> {
    aggregate(func: (x: TSource, y: TSource) => TSource): TSource,
    aggregate<TAccumulate>(seed: TAccumulate, func: (x: TAccumulate, y: TSource) => TAccumulate): TAccumulate,
    aggregate<TAccumulate, TResult>(
            seed: TAccumulate,
            func: (x: TAccumulate, y: TSource) => TAccumulate, resultSelector: (x: TAccumulate) => TResult): TResult,
    all(predicate: (x: TSource) => boolean): boolean,
    any(predicate?: (x: TSource) => boolean): boolean,
    average(this: IEnumerable<number>): number
    average(selector: (x: TSource) => number): number,
    concat(second: IEnumerable<TSource>): IEnumerable<TSource>,
    contains(value: TSource, comparer?: IEqualityComparer<TSource>): boolean,
    count(predicate?: (x: TSource) => boolean): number
    distinct(comparer?: IEqualityComparer<TSource>): IEnumerable<TSource>,
    elementAt(index: number): TSource,
    elementAtOrDefault(index: number): TSource | null,
    except(second: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): IEnumerable<TSource>,
    first(predicate?: (x: TSource) => boolean): TSource,
    firstOrDefault(predicate?: (x: TSource) => boolean): TSource | null,
    each(action: (x: TSource) => void): IEnumerable<TSource>,
    groupBy(keySelector: (x: TSource) => number): IEnumerable<IGrouping<number, TSource>>
    groupBy(keySelector: (x: TSource) => string): IEnumerable<IGrouping<string, TSource>>
    groupBy<TKey>(
            keySelector: (x: TSource) => TKey,
            comparer: IEqualityComparer<TKey>): IEnumerable<IGrouping<TKey, TSource>>,
    groupByWithSel<TElement>(
            keySelector: ((x: TSource) => number),
            elementSelector: (x: TSource) => TElement): IEnumerable<IGrouping<number, TElement>>
    groupByWithSel<TElement>(
            keySelector: ((x: TSource) => string),
            elementSelector: (x: TSource) => TElement): IEnumerable<IGrouping<string, TElement>>
    groupByWithSel<TKey, TElement>(
            keySelector: ((x: TSource) => TKey),
            elementSelector: (x: TSource) => TElement,
            comparer: IEqualityComparer<TKey>): IEnumerable<IGrouping<TKey, TElement>>,
    intersect(second: IEnumerable<TSource>, comparer?: IEqualityComparer<TSource>): IEnumerable<TSource>,
    // join in LINQ - but renamed to avoid clash with Array.prototype.join
    joinByKey<TInner, TKey, TResult>(
            inner: IEnumerable<TInner>,
            outerKeySelector: (x: TSource) => TKey,
            innerKeySelector: (x: TInner) => TKey,
            resultSelector: (x: TSource, y: TInner) => TResult,
            comparer?: IEqualityComparer<TKey>): IEnumerable<TResult>,
    last(predicate?: (x: TSource) => boolean): TSource,
    lastOrDefault(predicate?: (x: TSource) => boolean): TSource | null,
    max(this: IEnumerable<number>): number | never,
    max(selector: (x: TSource) => number): number | never,
    min(this: IEnumerable<number>): number | never,
    min(selector: (x: TSource) => number): number | never,
    /* tslint:disable:ban-types */
    ofType(type: "object"): IEnumerable<Object>
    ofType(type: "function"): IEnumerable<Function>
    ofType(type: "symbol"): IEnumerable<Symbol>
    /* tslint:enable:ban-types */
    ofType(type: "boolean"): IEnumerable<boolean>
    ofType(type: "number"): IEnumerable<number>
    ofType(type: "string"): IEnumerable<string>
    ofType<TResult>(type: IConstructor<TResult>): IEnumerable<TResult>,
    orderBy(predicate: (x: TSource) => number | string): IOrderedEnumerable<TSource>
    orderBy(predicate: (x: TSource) => number, comparer: IComparer<number>): IOrderedEnumerable<TSource>
    orderBy(predicate: (x: TSource) => string, comparer: IComparer<string>): IOrderedEnumerable<TSource>,
    orderByDescending(predicate: (x: TSource) => number | string): IOrderedEnumerable<TSource>
    orderByDescending(predicate: (x: TSource) => number, comparer: IComparer<number>): IOrderedEnumerable<TSource>
    orderByDescending(predicate: (x: TSource) => string, comparer: IComparer<string>): IOrderedEnumerable<TSource>,
    reverse(): IEnumerable<TSource>,
    select<OUT>(selector: (x: TSource) => OUT): IEnumerable<OUT>
    select<TKey extends keyof TSource>(key: TKey): IEnumerable<TSource[TKey]>,
    selectMany<OUT>(selector: (x: TSource) => Iterable<OUT>): IEnumerable<OUT>,
    selectMany<TBindedSource extends { [key: string]: Iterable<TOut>}, TOut>(
            this: IEnumerable<TBindedSource>,
            selector: keyof TBindedSource): IEnumerable<TOut>,
    sequenceEquals(second: IEnumerable<TSource>, comparer?: IEqualityComparer<TSource>): boolean,
    single(predicate?: (x: TSource) => boolean): TSource,
    singleOrDefault(predicate?: (x: TSource) => boolean): TSource | null,
    skip(count: number): IEnumerable<TSource>,
    skipWhile(predicate: (x: TSource, index: number) => boolean): IEnumerable<TSource>,
    sum(this: IEnumerable<number>): number
    sum(this: IEnumerable<TSource>, selector: (x: TSource) => number): number,
    take(amount: number): IEnumerable<TSource>,
    takeWhile(predicate: (x: TSource, index: number) => boolean): IEnumerable<TSource>,
    toArray(): TSource[],
    // = ToDictionary
    toMap<TKey>(selector: (x: TSource) => TKey): Map<TKey, TSource[]>,
    toSet(): Set<TSource>,
    union(second: Iterable<TSource>, comparer?: IEqualityComparer<TSource>): IEnumerable<TSource>,
    where(predicate: (x: TSource, index: number) => boolean): IEnumerable<TSource>,
    whereAsync(predicate: (x: TSource, index: number) => Promise<boolean>): IAsyncEnumerable<TSource>
    zip<TSecond>(second: Iterable<TSecond>): IEnumerable<ITuple<TSource, TSecond>>,
    zip<TSecond, TResult>(
            second: Iterable<TSecond>,
            resultSelector: (x: TSource, y: TSecond) => TResult): IEnumerable<TResult>,
    [Symbol.iterator]: () => IterableIterator<TSource>
}
