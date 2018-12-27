import {
        IAsyncEqualityComparer,
        IAsyncParallel,
        IComparer,
        IEqualityComparer,
        IGrouping,
        InferType,
        IOrderedAsyncEnumerable,
        OfType,
        SelectorKeyType } from "./"

export interface IAsyncEnumerable<TSource> extends IAsyncParallel<TSource> {
    asParallel(): IAsyncParallel<TSource>
    concat(second: IAsyncEnumerable<TSource>): IAsyncEnumerable<TSource>,
    distinct(comparer?: IEqualityComparer<TSource>): IAsyncEnumerable<TSource>,
    distinctAsync(comparer: IAsyncEqualityComparer<TSource>): IAsyncEnumerable<TSource>,
    each(action: (x: TSource) => void): IAsyncEnumerable<TSource>,
    eachAsync(action: (x: TSource) => Promise<void>): IAsyncEnumerable<TSource>,
    except(second: IAsyncEnumerable<TSource>, comparer?: IEqualityComparer<TSource>): IAsyncEnumerable<TSource>,
    exceptAsync(
            second: IAsyncEnumerable<TSource>,
            comparer: IAsyncEqualityComparer<TSource>): IAsyncEnumerable<TSource>,

    groupBy<TKey extends SelectorKeyType>(
            keySelector: (x: TSource) => TKey): IAsyncEnumerable<IGrouping<TKey, TSource>>
    groupBy<TKey>(
            keySelector: (x: TSource) => TKey,
            comparer: IEqualityComparer<TKey>): IAsyncEnumerable<IGrouping<TKey, TSource>>,

    groupByAsync<TKey extends SelectorKeyType>(
            keySelector: (x: TSource) => Promise<TKey> | TKey): IAsyncEnumerable<IGrouping<TKey, TSource>>
    groupByAsync<TKey>(
        keySelector: (x: TSource) => Promise<TKey> | TKey,
        comparer: IEqualityComparer<TKey> | IAsyncEqualityComparer<TKey>): IAsyncEnumerable<IGrouping<TKey, TSource>>,

    groupByWithSel<TElement, TKey extends SelectorKeyType>(
            keySelector: (x: TSource) => TKey,
            elementSelector: (x: TSource) => TElement): IAsyncEnumerable<IGrouping<TKey, TElement>>
    groupByWithSel<TKey, TElement>(
            keySelector: ((x: TSource) => TKey),
            elementSelector: (x: TSource) => TElement,
            comparer: IEqualityComparer<TKey>): IAsyncEnumerable<IGrouping<TKey, TElement>>,

    intersect(second: IAsyncEnumerable<TSource>, comparer?: IEqualityComparer<TSource>): IAsyncEnumerable<TSource>,
    intersectAsync(
            second: IAsyncEnumerable<TSource>,
            comparer: IAsyncEqualityComparer<TSource>): IAsyncEnumerable<TSource>,
    // join in LINQ - but renamed to avoid clash with Array.prototype.join
    joinByKey<TInner, TKey, TResult>(
            inner: IAsyncEnumerable<TInner>,
            outerKeySelector: (x: TSource) => TKey,
            innerKeySelector: (x: TInner) => TKey,
            resultSelector: (x: TSource, y: TInner) => TResult,
            comparer?: IEqualityComparer<TKey>): IAsyncEnumerable<TResult>
    ofType<TType extends OfType>(type: TType): IAsyncEnumerable<InferType<TType>>

    orderBy<TKey>(
        predicate: (x: TSource) => TKey,
        comparer?: IComparer<TKey>): IOrderedAsyncEnumerable<TSource>
    orderByAsync<TKey>(
        predicate: (x: TSource) => Promise<TKey>,
        comparer?: IComparer<TKey>): IOrderedAsyncEnumerable<TSource>
    orderByDescending<TKey>(
        predicate: (x: TSource) => TKey,
        comparer?: IComparer<TKey>): IOrderedAsyncEnumerable<TSource>
    orderByDescendingAsync<TKey>(
        predicate: (x: TSource) => Promise<TKey>,
        comparer?: IComparer<TKey>): IOrderedAsyncEnumerable<TSource>

    reverse(): IAsyncEnumerable<TSource>,
    select<TResult>(selector: (x: TSource, index: number) => TResult): IAsyncEnumerable<TResult>
    select<TKey extends keyof TSource>(key: TKey): IAsyncEnumerable<TSource[TKey]>,
    selectAsync<OUT>(selector: (x: TSource) => Promise<OUT>): IAsyncEnumerable<OUT>
    selectAsync<TKey extends keyof TSource, TResult>(
                this: IAsyncEnumerable<{ [key: string]: Promise<TResult> }>,
                key: TKey): IAsyncEnumerable<TResult>,
    selectMany<TResult>(selector: (x: TSource, index: number) => Iterable<TResult>): IAsyncEnumerable<TResult>,
    selectMany<TBindedSource extends { [key: string]: Iterable<TOut>}, TOut>(
            this: IAsyncEnumerable<TBindedSource>,
            selector: keyof TBindedSource): IAsyncEnumerable<TOut>,
    selectManyAsync<OUT>(selector: (x: TSource) => Promise<Iterable<OUT>>): IAsyncEnumerable<OUT>,
    sequenceEquals(second: AsyncIterable<TSource>, comparer?: IEqualityComparer<TSource>): Promise<boolean>,
    sequenceEqualsAsync(second: AsyncIterable<TSource>,
                        comparer: IAsyncEqualityComparer<TSource>): Promise<boolean>
    skip(count: number): IAsyncEnumerable<TSource>,
    skipWhile(predicate: (x: TSource, index: number) => boolean): IAsyncEnumerable<TSource>,
    skipWhileAsync(predicate: (x: TSource, index: number) => Promise<boolean>): IAsyncEnumerable<TSource>,
    take(amount: number): IAsyncEnumerable<TSource>,
    takeWhile(pedicate: (x: TSource, index: number) => boolean): IAsyncEnumerable<TSource>
    takeWhileAsync(pedicate: (x: TSource, index: number) => Promise<boolean>): IAsyncEnumerable<TSource>
    union(second: AsyncIterable<TSource>, comparer?: IEqualityComparer<TSource>): IAsyncEnumerable<TSource>,
    unionAsync(second: AsyncIterable<TSource>, comparer: IAsyncEqualityComparer<TSource>): IAsyncEnumerable<TSource>,
    where(predicate: (x: TSource, index: number) => boolean): IAsyncEnumerable<TSource>,
    whereAsync(predicate: (x: TSource, index: number) => Promise<boolean>): IAsyncEnumerable<TSource>
    zip<TSecond, TResult>(
        second: AsyncIterable<TSecond>,
        resultSelector: (x: TSource, y: TSecond) => TResult): IAsyncEnumerable<TResult>,
    zip<TSecond>(second: AsyncIterable<TSecond>): IAsyncEnumerable<[TSource, TSecond]>,
    zipAsync<TSecond, TResult>(
        second: AsyncIterable<TSecond>,
        resultSelector: (x: TSource, y: TSecond) => Promise<TResult>): IAsyncEnumerable<TResult>,
}
