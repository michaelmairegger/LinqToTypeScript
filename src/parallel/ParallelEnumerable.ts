import { from as fromAsync, IAsyncEnumerable } from "../async/async"
import {
    ArgumentOutOfRangeException,
    EqualityComparer,
    ErrorString,
    IAsyncEqualityComparer,
    IAsyncParallel,
    IComparer,
    IEqualityComparer,
    IGrouping,
    InferType,
    InvalidOperationException,
    ITuple,
    OfType,
    StrictEqualityComparer } from "../shared/shared"
import { BasicParallelEnumerable } from "./BasicParallelEnumerable"
import { IOrderedParallelEnumerable } from "./IOrderedParallelEnumerable"
import { IParallelEnumerable } from "./IParallelEnumerable"
import { OrderedParallelEnumerable } from "./OrderedParallelEnumerable"
import * as ParallelEnumerablePrivate from "./ParallelEnumerablePrivate"
import { ParallelGeneratorType } from "./ParallelGeneratorType"
import { TypedData } from "./TypedData"

/**
 * Contains static methods to work with Parallel Async
 */

export function aggregate<TSource>(
    source: AsyncIterable<TSource>,
    func: (x: TSource, y: TSource) => TSource): Promise<TSource>
export function aggregate<TSource, TAccumulate>(
    source: AsyncIterable<TSource>,
    seed: TAccumulate,
    func: (x: TAccumulate, y: TSource) => TAccumulate): Promise<TAccumulate>
export function aggregate<TSource, TAccumulate, TResult>(
    source: AsyncIterable<TSource>,
    seed: TAccumulate,
    func: (x: TAccumulate, y: TSource) => TAccumulate,
    resultSelector: (x: TAccumulate) => TResult): Promise<TResult>
export function aggregate<TSource, TAccumulate, TResult>(
    source: AsyncIterable<TSource>,
    seedOrFunc: ((x: TSource, y: TSource) => TSource) | TAccumulate,
    func?: (x: TAccumulate, y: TSource) => TAccumulate,
    resultSelector?: (x: TAccumulate) => TResult): Promise<TSource | TAccumulate | TResult | null> {
    if (resultSelector) {
        if (!func) {
            throw new ReferenceError(`TAccumulate function is undefined`)
        }

        return ParallelEnumerablePrivate.aggregate_3(source, seedOrFunc as TAccumulate, func, resultSelector)
    } else if (func) {
        return ParallelEnumerablePrivate.aggregate_2(source, seedOrFunc as TAccumulate, func)
    } else {
        return ParallelEnumerablePrivate.aggregate_1(source, seedOrFunc as ((x: TSource, y: TSource) => TSource))
    }
}

export async function all<TSource>(
    source: IParallelEnumerable<TSource>,
    predicate: (x: TSource) => boolean): Promise<boolean> {
    const nextIter = ParallelEnumerablePrivate.nextIteration(source, (x) => {
        if (!predicate(x)) {
            throw new Error(String(false))
        }
        return true
    })

    switch (nextIter.type) {
        case ParallelGeneratorType.PromiseToArray:
            return nextIter.generator()
                .then(() => true, () => false)
        case ParallelGeneratorType.ArrayOfPromises:
            return Promise.all(nextIter.generator())
                .then(() => true, () => false)
        case ParallelGeneratorType.PromiseOfPromises:
            return nextIter.generator()
                .then(Promise.all.bind(Promise))
                .then(() => true, () => false)
    }
}

export async function allAsync<TSource>(
    source: IParallelEnumerable<TSource>,
    predicate: (x: TSource) => Promise<boolean>): Promise<boolean> {
    const nextIter = ParallelEnumerablePrivate.nextIterationAsync(source, async (x) => {
        if (await predicate(x) === false) {
            throw new Error(String(false))
        }
        return true
    })

    switch (nextIter.type) {
        case ParallelGeneratorType.PromiseToArray:
            return nextIter
                .generator()
                .then(() => true, () => false)
        case ParallelGeneratorType.ArrayOfPromises:
            return Promise.all(nextIter.generator())
                .then(() => true, () => false)
        case ParallelGeneratorType.PromiseOfPromises:
            return nextIter.generator()
                .then(Promise.all.bind(Promise))
                .then(() => true, () => false)
    }
}

export function empty<TSource>(): IParallelEnumerable<TSource> {
    const dataFunc: TypedData<TSource> = {
        generator: async () => [],
        type: ParallelGeneratorType.PromiseToArray,
    }

    return new BasicParallelEnumerable(dataFunc)
}

export function any<TSource>(source: IParallelEnumerable<TSource>, predicate?: (x: TSource) => boolean) {
    const nextIter = ParallelEnumerablePrivate.nextIteration(source, predicate || ((_) => true))

    switch (nextIter.type) {
        case ParallelGeneratorType.PromiseToArray:
            return nextIter.generator().then((values) => {
                return values.some((x) => x)
            })
        case ParallelGeneratorType.ArrayOfPromises:
            return Promise.all(nextIter.generator()).then((values) => {
                return values.some((x) => x)
            })
        case ParallelGeneratorType.PromiseOfPromises:
            return nextIter.generator().then((values) => Promise.all(values)).then((values) => {
                return values.some((x) => x)
            })
    }
}

export async function anyAsync<TSource>(
    source: IParallelEnumerable<TSource>, predicate: (x: TSource) => Promise<boolean>): Promise<boolean> {
    const nextIter = ParallelEnumerablePrivate.nextIterationAsync(source, predicate)

    switch (nextIter.type) {
        case ParallelGeneratorType.PromiseToArray:
            return nextIter.generator().then((values) => {
                return values.some((x) => x)
            })
        case ParallelGeneratorType.ArrayOfPromises:
            return Promise.all(nextIter.generator()).then((values) => {
                return values.some((x) => x)
            })
        case ParallelGeneratorType.PromiseOfPromises:
            return nextIter.generator().then((values) => Promise.all(values)).then((values) => {
                return values.some((x) => x)
            })
    }
}

export function asAsync<TSource>(source: IParallelEnumerable<TSource>): IAsyncEnumerable<TSource> {
    async function* generator() {
        for await (const value of source) {
            yield value
        }
    }
    return fromAsync(generator)
}

export function average(
    source: IAsyncParallel<number>): Promise<number>
export function average<TSource>(
    source: IAsyncParallel<TSource>, selector: (x: TSource) => number): Promise<number>
export function average<TSource>(
    source: IAsyncParallel<TSource> | IAsyncParallel<number>,
    selector?: (x: TSource) => number): Promise<number> {
    if (selector) {
        return ParallelEnumerablePrivate.average_2(source as IAsyncParallel<TSource>, selector)
    } else {
        return ParallelEnumerablePrivate.average_1(source as IAsyncParallel<number>)
    }
}

export async function averageAsync<TSource>(
    source: IParallelEnumerable<TSource>, selector: (x: TSource) => Promise<number>): Promise<number> {
    const nextIter = ParallelEnumerablePrivate.nextIterationAsync(source, selector)
    let values: Array<number | Promise<number>>
    switch (nextIter.type) {
        case ParallelGeneratorType.ArrayOfPromises:
            values = nextIter.generator()
            break
        case ParallelGeneratorType.PromiseOfPromises:
            values = await nextIter.generator()
            break
        case ParallelGeneratorType.PromiseToArray:
        default:
            values = await nextIter.generator()
            break
    }

    if (values.length === 0) {
        throw new InvalidOperationException(ErrorString.NoElements)
    }

    let value = 0
    for (const selectedValue of values) {
        value += await selectedValue
    }

    return value / values.length
}

export function concat<TSource>(
    // tslint:disable-next-line:no-shadowed-variable
    first: IAsyncParallel<TSource>, second: IAsyncParallel<TSource>): IParallelEnumerable<TSource> {
    const generator = async () => {
        // Wait for both enumerables
        const promiseResults = await Promise.all([ first.toArray(), second.toArray() ])
        // Concat
        const firstData = promiseResults[0]
        const secondData = promiseResults[1]
        const data = new Array(firstData.length + secondData.length)
        let i = 0
        for (; i < firstData.length; i++) {
            data[i] = firstData[i]
        }

        for (let j = 0; j < secondData.length; j++, i++) {
            data[i] = secondData[j]
        }

        return data
    }

    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export async function contains<TSource>(
    source: IParallelEnumerable<TSource>,
    value: TSource,
    comparer: IEqualityComparer<TSource> = StrictEqualityComparer): Promise<boolean> {
    let values: TypedData<boolean>
    if (comparer) {
        values = ParallelEnumerablePrivate.nextIteration(source, (x) => comparer(value, x))
    } else {
        values = ParallelEnumerablePrivate.nextIteration(source, (x) => x === value)
    }

    switch (values.type) {
        case ParallelGeneratorType.PromiseToArray:
        {
            const data = await values.generator()
            return data.some((x) => x)
        }
        case ParallelGeneratorType.ArrayOfPromises:
        {
            const data = await Promise.all(values.generator())
            return data.some((x) => x)
        }
        case ParallelGeneratorType.PromiseOfPromises:
        {
            const data = await Promise.all(await values.generator())
            return data.some((x) => x)
        }
    }
}

export async function containsAsync<TSource>(
    source: IParallelEnumerable<TSource>,
    value: TSource,
    comparer: IAsyncEqualityComparer<TSource>): Promise<boolean> {
    const values = ParallelEnumerablePrivate.nextIterationAsync(source, (x) => comparer(value, x))

    switch (values.type) {
        case ParallelGeneratorType.PromiseToArray:
        {
            const data = await values.generator()
            return data.some((x) => x)
        }
        case ParallelGeneratorType.ArrayOfPromises:
        {
            const data = await Promise.all(values.generator())
            return data.some((x) => x)
        }
        case ParallelGeneratorType.PromiseOfPromises:
        {
            const data = await Promise.all(await values.generator())
            return data.some((x) => x)
        }
    }
}

export function count<TSource>(
    source: IParallelEnumerable<TSource>,
    predicate?: (x: TSource) => boolean): Promise<number> {
    if (predicate) {
        return ParallelEnumerablePrivate.count_2(source, predicate)
    } else {
        return ParallelEnumerablePrivate.count_1(source)
    }
}

export async function countAsync<TSource>(
    source: IParallelEnumerable<TSource>,
    predicate: (x: TSource) => Promise<boolean>): Promise<number> {
    const data = ParallelEnumerablePrivate.nextIterationAsync(source, predicate)
    let countPromise: Promise<boolean[]>
    switch (data.type) {
        case ParallelGeneratorType.ArrayOfPromises:
            countPromise = Promise.all(data.generator())
            break
        case ParallelGeneratorType.PromiseOfPromises:
            countPromise = Promise.all(await data.generator())
            break
        case ParallelGeneratorType.PromiseToArray:
        default:
            countPromise = data.generator()
            break
    }

    let totalCount = 0
    for (const value of await countPromise) {
        if (value) {
            totalCount++
        }
    }

    return totalCount
}

export function distinct<TSource>(
    source: IAsyncParallel<TSource>,
    comparer: IEqualityComparer<TSource> = StrictEqualityComparer): IParallelEnumerable<TSource> {
    const generator = async () => {
        const distinctElements: TSource[] = []
        for (const item of await source.toArray()) {
            const foundItem = distinctElements.find((x) => comparer(x, item))
            if (!foundItem) {
                distinctElements.push(item)
            }
        }
        return distinctElements
    }

    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export function distinctAsync<TSource>(
    source: IAsyncParallel<TSource>,
    comparer: IAsyncEqualityComparer<TSource>): IParallelEnumerable<TSource> {
    const generator = async () => {
        const distinctElements: TSource[] = []
        outerLoop:
        for (const item of await source.toArray()) {
            for (const distinctElement of distinctElements) {
                const found = await comparer(distinctElement, item)
                if (found) {
                    continue outerLoop
                }
            }

            distinctElements.push(item)
        }

        return distinctElements
    }

    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export function each<TSource>(
    source: IParallelEnumerable<TSource>,
    action: (x: TSource) => void): IParallelEnumerable<TSource> {
    return new BasicParallelEnumerable(ParallelEnumerablePrivate.nextIteration(source, (x) => {
            action(x)
            return x
        }))
}

export function eachAsync<TSource>(
    source: IParallelEnumerable<TSource>,
    action: (x: TSource) => Promise<void>): IParallelEnumerable<TSource> {
    return new BasicParallelEnumerable(ParallelEnumerablePrivate.nextIterationAsync(source, async (x) => {
            await action(x)
            return x
        }))
}

export async function elementAt<TSource>(
    source: IParallelEnumerable<TSource>,
    index: number): Promise<TSource> {
    if (index < 0) {
        throw new ArgumentOutOfRangeException("index")
    }

    const dataFunc = source.dataFunc

    switch (dataFunc.type) {
        case ParallelGeneratorType.PromiseToArray:
            return dataFunc.generator().then((values) => {
                if (index >= values.length) {
                    throw new ArgumentOutOfRangeException("index")
                } else {
                    return values[index]
                }
            })
        case ParallelGeneratorType.ArrayOfPromises:
            return Promise.all(dataFunc.generator()).then((values) => {
                if (index >= values.length) {
                    throw new ArgumentOutOfRangeException("index")
                } else {
                    return values[index]
                }
            })
        case ParallelGeneratorType.PromiseOfPromises:
            return dataFunc.generator().then(async (values) => {
                if (index >= values.length) {
                    throw new ArgumentOutOfRangeException("index")
                } else {
                    return await values[index]
                }
            })
    }
}

export async function elementAtOrDefault<TSource>(
    source: IParallelEnumerable<TSource>,
    index: number): Promise<TSource | null> {
    const dataFunc = source.dataFunc

    switch (dataFunc.type) {
        case ParallelGeneratorType.PromiseToArray:
            return dataFunc.generator().then((values) => {
                if (index >= values.length) {
                    return null
                } else {
                    return values[index]
                }
            })
        case ParallelGeneratorType.ArrayOfPromises:
            return Promise.all(dataFunc.generator()).then((values) => {
                if (index >= values.length) {
                    return null
                } else {
                    return values[index]
                }
            })
        case ParallelGeneratorType.PromiseOfPromises:
            return dataFunc.generator().then(async (values) => {
                if (index >= values.length) {
                    return null
                } else {
                    return await values[index]
                }
            })
    }
}

export function except<TSource>(
    // tslint:disable-next-line:no-shadowed-variable
    first: IAsyncParallel<TSource>,
    second: IAsyncParallel<TSource>,
    comparer: IEqualityComparer<TSource> = EqualityComparer): IParallelEnumerable<TSource> {

    const generator = async () => {
        const values = await Promise.all([ first.toArray(), second.toArray() ])
        const firstValues = values[0]
        const secondValues = values[1]
        const resultValues = []

        for (const firstItem of firstValues) {

            let exists = false
            for (let j = 0; j < secondValues.length; j++) {
                const secondItem = secondValues[j]

                if (comparer(firstItem, secondItem) === true) {
                    exists = true
                    break
                }
            }

            if (exists === false) {
                resultValues.push(firstItem)
            }
        }

        return resultValues
    }

    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export function exceptAsync<TSource>(
    // tslint:disable-next-line:no-shadowed-variable
    first: IAsyncParallel<TSource>,
    second: IAsyncParallel<TSource>,
    comparer: IAsyncEqualityComparer<TSource>): IParallelEnumerable<TSource> {

    const generator = async () => {
        const values = await Promise.all([ first.toArray(), second.toArray() ])
        const firstValues = values[0]
        const secondValues = values[1]
        const resultValues = []

        for (const firstItem of firstValues) {

            let exists = false
            for (let j = 0; j < secondValues.length; j++) {
                const secondItem = secondValues[j]

                if (await comparer(firstItem, secondItem) === true) {
                    exists = true
                    break
                }
            }

            if (exists === false) {
                resultValues.push(firstItem)
            }
        }

        return resultValues
    }

    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export function first<TSource>(
    source: IParallelEnumerable<TSource>,
    predicate?: (x: TSource) => boolean): Promise<TSource> {
    if (predicate) {
        return ParallelEnumerablePrivate.first_2(source, predicate)
    } else {
        return ParallelEnumerablePrivate.first_1(source)
    }
}

export async function firstAsync<TSource>(
    source: IParallelEnumerable<TSource>,
    predicate: (x: TSource) => Promise<boolean>): Promise<TSource> {
    const data = await ParallelEnumerablePrivate.toArray(source)
    for (const value of data) {
        if (await predicate(value) === true) {
            return value
        }
    }

    throw new InvalidOperationException(ErrorString.NoMatch)
}

export function firstOrDefault<TSource>(
    source: IParallelEnumerable<TSource>,
    predicate?: (x: TSource) => boolean): Promise<TSource | null> {
    if (predicate) {
        return ParallelEnumerablePrivate.firstOrDefault_2(source, predicate)
    } else {
        return ParallelEnumerablePrivate.firstOrDefault_1(source)
    }
}

export async function firstOrDefaultAsync<TSource>(
    source: IParallelEnumerable<TSource>,
    predicate: (x: TSource) => Promise<boolean>): Promise<TSource | null> {
    const data = await ParallelEnumerablePrivate.toArray(source)
    for (const value of data) {
        if (await predicate(value) === true) {
            return value
        }
    }

    return null
}

export function flatten<TSource>(
    source: IAsyncParallel<TSource | IAsyncParallel<TSource>>): IParallelEnumerable<TSource>
export function flatten<TSource>(
    source: IAsyncParallel<TSource | IAsyncParallel<TSource>>,
    shallow: false): IParallelEnumerable<TSource>
export function flatten<TSource>(
    source: IAsyncParallel<TSource | IAsyncParallel<TSource>>,
    shallow: true): IParallelEnumerable<TSource | AsyncIterable<TSource>>
export function flatten<TSource>(
    source: IAsyncParallel<TSource | IAsyncParallel<TSource>>,
    shallow?: boolean): IParallelEnumerable<TSource | AsyncIterable<TSource>> {

    async function* iterator(sourceInner: AsyncIterable<any>)
        : AsyncIterableIterator<TSource | AsyncIterable<TSource>> {
        for await (const item of sourceInner) {
            if (item[Symbol.asyncIterator] !== undefined) {
                const items = shallow ? item : iterator(item as AsyncIterable<any>)
                for await (const inner of items) {
                    yield inner
                }
            } else {
                yield item
            }
        }
    }

    const generator = async () => {
        const results = new Array()
        for await (const x of iterator(source)) {
            results.push(x)
        }
        return results
    }

    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

/**
 * Creates an IParallelEnumerable from a function that returns an Array of Promises
 */
export function from<TSource>(
    type: ParallelGeneratorType.ArrayOfPromises,
    generator: () => Array<Promise<TSource>>): IParallelEnumerable<TSource>
/**
 * Creates an IParallelEnumerable from a function that returns a Promise of data values
 */
export function from<TSource>(
    type: ParallelGeneratorType.PromiseToArray,
    generator: () => Promise<TSource[]>): IParallelEnumerable<TSource>
/**
 * Creates an IParallelEnumerable from a function that returns an promise of an array of promises
 */
export function from<TSource>(
    type: ParallelGeneratorType.PromiseOfPromises,
    generator: () => Promise<Array<Promise<TSource>>>): IParallelEnumerable<TSource>
export function from<TSource>(
    type: any,
    generator: () => any) {
    return new BasicParallelEnumerable<TSource>({
        generator,
        type,
    })
}

export function groupBy<TSource>(
    source: IAsyncParallel<TSource>,
    keySelector: (x: TSource) => number): IParallelEnumerable<IGrouping<number, TSource>>
export function groupBy<TSource>(
    source: IAsyncParallel<TSource>,
    keySelector: (x: TSource) => string): IParallelEnumerable<IGrouping<string, TSource>>
export function groupBy<TSource, TKey>(
    source: IAsyncParallel<TSource>,
    keySelector: (x: TSource) => TKey,
    comparer: IEqualityComparer<TKey>): IParallelEnumerable<IGrouping<TKey, TSource>>
export function groupBy<TSource, TKey>(
    source: IAsyncParallel<TSource>,
    keySelector: ((x: TSource) => TKey) | ((x: TSource) => number) | ((x: TSource) => string),
    comparer?: IEqualityComparer<TKey>): IParallelEnumerable<IGrouping<any, TSource>> {

    if (comparer) {
        return ParallelEnumerablePrivate.groupBy_0<TSource, TKey>(source,
            keySelector as (x: TSource) => TKey, comparer)
    } else {
        return ParallelEnumerablePrivate.groupBy_0_Simple(source,
            keySelector as ((x: TSource) => number) | ((x: TSource) => string))
    }
}

export function groupByAsync<TSource>(
    source: IAsyncParallel<TSource>,
    keySelector: (x: TSource) => Promise<number> | number): IParallelEnumerable<IGrouping<number, TSource>>
export function groupByAsync<TSource>(
    source: IAsyncParallel<TSource>,
    keySelector: (x: TSource) => Promise<string> | string): IParallelEnumerable<IGrouping<string, TSource>>
export function groupByAsync<TSource, TKey>(
    source: IAsyncParallel<TSource>,
    keySelector: (x: TSource) => Promise<TKey> | TKey,
    comparer: IEqualityComparer<TKey> | IAsyncEqualityComparer<TKey>): IParallelEnumerable<IGrouping<TKey, TSource>>
export function groupByAsync<TSource, TKey>(
    source: IAsyncParallel<TSource>,
    keySelector: (x: TSource) => Promise<TKey> | TKey,
    comparer?: IEqualityComparer<TKey> | IAsyncEqualityComparer<TKey>)
        : IParallelEnumerable<IGrouping<any, TSource>> {

    if (comparer) {
        return ParallelEnumerablePrivate.groupByAsync_0<TSource, TKey>(source,
            keySelector, comparer)
    } else {
        return ParallelEnumerablePrivate.groupByAsync_0_Simple(source,
            keySelector as (x: TSource) => any)
    }
}

export function groupByWithSel<TSource, TElement>(
    source: IAsyncParallel<TSource>,
    keySelector: ((x: TSource) => number),
    elementSelector: (x: TSource) => TElement): IParallelEnumerable<IGrouping<number, TElement>>
export function groupByWithSel<TSource, TElement>(
    source: IAsyncParallel<TSource>,
    keySelector: ((x: TSource) => string),
    elementSelector: (x: TSource) => TElement): IParallelEnumerable<IGrouping<string, TElement>>
export function groupByWithSel<TSource, TKey, TElement>(
    source: IAsyncParallel<TSource>,
    keySelector: ((x: TSource) => TKey),
    elementSelector: (x: TSource) => TElement,
    comparer: IEqualityComparer<TKey>): IParallelEnumerable<IGrouping<TKey, TElement>>
export function groupByWithSel<TSource, TKey, TElement>(
    source: IAsyncParallel<TSource>,
    keySelector: ((x: TSource) => TKey) | ((x: TSource) => number) | ((x: TSource) => string),
    elementSelector: (x: TSource) => TElement,
    comparer?: IEqualityComparer<TKey>): IParallelEnumerable<IGrouping<any, TElement>> {

    if (comparer) {
        return ParallelEnumerablePrivate.groupBy_1(source,
            keySelector as (x: TSource) => TKey, elementSelector, comparer)
    } else {
        return ParallelEnumerablePrivate.groupBy_1_Simple(source,
            keySelector as (x: TSource) => number | string, elementSelector)
    }
}

export function join<TOuter, TInner, TKey, TResult>(
    outer: IAsyncParallel<TOuter>,
    inner: IAsyncParallel<TInner>,
    outerKeySelector: (x: TOuter) => TKey,
    innerKeySelector: (x: TInner) => TKey,
    resultSelector: (x: TOuter, y: TInner) => TResult): IParallelEnumerable<TResult>
export function join<TOuter, TInner, TKey, TResult>(
    outer: IAsyncParallel<TOuter>,
    inner: IAsyncParallel<TInner>,
    outerKeySelector: (x: TOuter) => TKey,
    innerKeySelector: (x: TInner) => TKey,
    resultSelector: (x: TOuter, y: TInner) => TResult,
    comparer: IEqualityComparer<TKey>): IParallelEnumerable<TResult>
export function join<TOuter, TInner, TKey, TResult>(
    outer: IAsyncParallel<TOuter>,
    inner: IAsyncParallel<TInner>,
    outerKeySelector: (x: TOuter) => TKey,
    innerKeySelector: (x: TInner) => TKey,
    resultSelector: (x: TOuter, y: TInner) => TResult,
    comparer: IEqualityComparer<TKey> = StrictEqualityComparer): IParallelEnumerable<TResult> {
    const generator = async () => {
        const innerOuter = await Promise.all([inner.toArray(), outer.toArray()])
        const innerArray = innerOuter[0]
        const outerArray = innerOuter[1]

        const results = new Array<TResult>()
        for (const o of outerArray) {
            const outerKey = outerKeySelector(o)

            for (const i of innerArray) {
                const innerKey = innerKeySelector(i)
                if (comparer(outerKey, innerKey) === true) {
                    results.push(resultSelector(o, i))
                }
            }
        }
        return results
    }

    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export function intersect<TSource>(
    // tslint:disable-next-line:no-shadowed-variable
    first: IParallelEnumerable<TSource>,
    second: IAsyncParallel<TSource>,
    comparer: IEqualityComparer<TSource> = StrictEqualityComparer): IParallelEnumerable<TSource> {

    const generator = async () => {

        const firstResults = await first.distinct(comparer).toArray()

        if (firstResults.length === 0) {
            return []
        }

        const secondResults = await second.toArray()

        const results = new Array<TSource>()
        for (let i = 0; i < firstResults.length; i++) {
            const firstValue = firstResults[i]

            for (let j = 0; j < secondResults.length; j++) {
                const secondValue = secondResults[j]

                if (comparer(firstValue, secondValue) === true) {
                    results.push(firstValue)
                    break
                }
            }
        }
        return results
    }

    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export function intersectAsync<TSource>(
    // tslint:disable-next-line:no-shadowed-variable
    first: IParallelEnumerable<TSource>,
    second: IAsyncParallel<TSource>,
    comparer: IAsyncEqualityComparer<TSource>): IParallelEnumerable<TSource> {

    const generator = async () => {

        const firstResults = await first.distinctAsync(comparer).toArray()

        if (firstResults.length === 0) {
            return []
        }

        const secondResults = await second.toArray()

        const results = new Array<TSource>()
        for (let i = 0; i < firstResults.length; i++) {
            const firstValue = firstResults[i]

            for (let j = 0; j < secondResults.length; j++) {
                const secondValue = secondResults[j]

                if (await comparer(firstValue, secondValue) === true) {
                    results.push(firstValue)
                    break
                }
            }
        }
        return results
    }

    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export async function min(
    source: IParallelEnumerable<number>): Promise<number>
export async function min<TSource>(
    source: IParallelEnumerable<TSource>,
    selector: (x: TSource) => number): Promise<number>
export async function min<TSource>(
    source: IParallelEnumerable<TSource>,
    selector?: (x: TSource) => number): Promise<number> {
    let minInfo: any[]
    if (selector) {
        const dataFunc = ParallelEnumerablePrivate.nextIteration(source, selector)
        minInfo = await new BasicParallelEnumerable(dataFunc)
            .toArray()
    } else {
        minInfo = await source.toArray()
    }

    if (minInfo.length === 0) {
        throw new InvalidOperationException(ErrorString.NoElements)
    }

    return Math.min.apply(null, minInfo)
}

export function last<TSource>(
    source: IParallelEnumerable<TSource>,
    predicate?: (x: TSource) => boolean): Promise<TSource> {
    if (predicate) {
        return ParallelEnumerablePrivate.last_2(source, predicate)
    } else {
        return ParallelEnumerablePrivate.last_1(source)
    }
}

export async function lastAsync<TSource>(
    source: IParallelEnumerable<TSource>,
    predicate: (x: TSource) => Promise<boolean>): Promise<TSource> {
    const dataFunc = source.dataFunc
    switch (dataFunc.type) {
        case ParallelGeneratorType.PromiseToArray:
        {
            const values = await dataFunc.generator()
            // Promise Array - Predicate
            for (let i = values.length - 1; i >= 0; i--) {
                const value = values[i]
                if (await predicate(value) === true) {
                    return value
                }
            }
            break
        }
        case ParallelGeneratorType.ArrayOfPromises:
        {
            const promises = dataFunc.generator()
            // Promise Array - Predicate
            for (let i = promises.length - 1; i >= 0; i--) {
                const value = await promises[i]
                if (await predicate(value) === true) {
                    return value
                }
            }
            break
        }
        case ParallelGeneratorType.PromiseOfPromises:
        {
            const promises = await dataFunc.generator()
            // Promise Array - Predicate
            for (let i = promises.length - 1; i >= 0; i--) {
                const value = await promises[i]
                if (await predicate(value) === true) {
                    return value
                }
            }
            break
        }
    }

    throw new InvalidOperationException(ErrorString.NoMatch)
}

export async function lastOrDefault<TSource>(
    source: IParallelEnumerable<TSource>,
    predicate?: (x: TSource) => boolean): Promise<TSource | null> {
    if (predicate) {
        return ParallelEnumerablePrivate.lastOrDefault_2(source, predicate)
    } else {
        return ParallelEnumerablePrivate.lastOrDefault_1(source)
    }
}

export async function lastOrDefaultAsync<TSource>(
    source: IParallelEnumerable<TSource>,
    predicate: (x: TSource) => Promise<boolean>): Promise<TSource | null> {
    const dataFunc = source.dataFunc
    switch (dataFunc.type) {
        case ParallelGeneratorType.PromiseToArray:
        {
            const values = await dataFunc.generator()
            for (let i = values.length - 1; i >= 0; i--) {
                const value = values[i]
                if (await predicate(value) === true) {
                    return value
                }
            }

            break
        }
        case ParallelGeneratorType.ArrayOfPromises:
        {
            const promises = dataFunc.generator()
            for (let i = promises.length - 1; i >= 0; i--) {
                const value = await promises[i]
                if (await predicate(value) === true) {
                    return value
                }
            }

            break
        }
        case ParallelGeneratorType.PromiseOfPromises:
        {
            const promises = await dataFunc.generator()
            for (let i = promises.length - 1; i >= 0; i--) {
                const value = await promises[i]
                if (await predicate(value) === true) {
                    return value
                }
            }

            break
        }
    }

    return null
}

export async function max(source: IParallelEnumerable<number>): Promise<number>
export async function max<TSource>(
    source: IParallelEnumerable<TSource>,
    selector: (x: TSource) => number): Promise<number>
export async function max<TSource>(
    source: IParallelEnumerable<TSource>,
    selector?: (x: TSource) => number): Promise<number> {
    let maxInfo: any[]
    if (selector) {
        const dataFunc = ParallelEnumerablePrivate.nextIteration(source, selector)
        maxInfo = await new BasicParallelEnumerable(dataFunc).toArray()
    } else {
        maxInfo = await source.toArray()
    }

    if (maxInfo.length === 0) {
        throw new InvalidOperationException(ErrorString.NoElements)
    }

    return Math.max.apply(null, maxInfo)
}

export async function maxAsync<TSource>(
    source: IParallelEnumerable<TSource>,
    selector: (x: TSource) => Promise<number>): Promise<number> {
    const dataFunc = ParallelEnumerablePrivate.nextIterationAsync(source, selector)
    const maxInfo = await new BasicParallelEnumerable(dataFunc).toArray()

    if (maxInfo.length === 0) {
        throw new InvalidOperationException(ErrorString.NoElements)
    }

    return Math.max.apply(null, maxInfo)
}

export async function minAsync<TSource>(
    source: IParallelEnumerable<TSource>,
    selector: (x: TSource) => Promise<number>): Promise<number> {
    const dataFunc = ParallelEnumerablePrivate.nextIterationAsync(source, selector)
    const maxInfo = await new BasicParallelEnumerable(dataFunc).toArray()

    if (maxInfo.length === 0) {
        throw new InvalidOperationException(ErrorString.NoElements)
    }

    return Math.min.apply(null, maxInfo)
}

export function select<TSource, OUT>(
    source: IParallelEnumerable<TSource>,
    selector: (x: TSource) => OUT): IParallelEnumerable<OUT>
export function select<TSource, TKey extends keyof TSource>(
    source: IParallelEnumerable<TSource>,
    key: TKey): IParallelEnumerable<TSource[TKey]>
export function select<TSource, OUT>(
    source: IParallelEnumerable<TSource>,
    key: string | ((x: TSource) => OUT)): IParallelEnumerable<any> {
    if (typeof key === "string") {
        return new BasicParallelEnumerable(ParallelEnumerablePrivate.nextIteration(source, (x: any) => x[key] as OUT))
    } else {
        return new BasicParallelEnumerable(ParallelEnumerablePrivate.nextIteration(source, key))
    }
}

export function selectAsync<TSource, OUT>(
    source: IParallelEnumerable<TSource>,
    selector: (x: TSource) => Promise<OUT>): IParallelEnumerable<OUT>
export function selectAsync<TSource extends { [key: string]: Promise<TResult> }, TKey extends keyof TSource, TResult>(
    source: IParallelEnumerable<TResult>,
    selector: TKey): IParallelEnumerable<TResult>
export function selectAsync<TSource extends { [key: string]: Promise<OUT> }, OUT>(
    source: IParallelEnumerable<TSource>,
    keyOrSelector: string | ((x: TSource) => Promise<OUT>)): IParallelEnumerable<OUT> {
    let selector: (x: TSource) => Promise<OUT>
    if (typeof keyOrSelector === "string") {
        selector = (x: TSource) => (x[keyOrSelector])
    } else {
        selector = keyOrSelector
    }

    const generator = ParallelEnumerablePrivate.nextIterationAsync(source, selector)
    return new BasicParallelEnumerable(generator)
}

export function selectMany<TSource, OUT>(
    source: IParallelEnumerable<TSource>,
    selector: (x: TSource) => Iterable<OUT>): IParallelEnumerable<OUT>
export function selectMany<TBindedSource extends { [key: string]: Iterable<TOut> }, TOut>(
    source: IParallelEnumerable<TBindedSource>, selector: keyof TBindedSource): IParallelEnumerable<TOut>
export function selectMany<TSource, OUT>(
    source: IParallelEnumerable<TSource>,
    selector: ((x: TSource) => Iterable<OUT>) | keyof TSource): IParallelEnumerable<any> {
    const generator = async () => {
        let values: TypedData<Iterable<OUT>>
        if (typeof selector === "string") {
            values = await ParallelEnumerablePrivate.nextIteration(source, (x: any) => x[selector])
        } else {
            values = await ParallelEnumerablePrivate.nextIteration(source, selector as (x: TSource) => Iterable<OUT>)
        }

        const valuesArray = []
        switch (values.type) {
            case ParallelGeneratorType.PromiseToArray:
            {
                for (const outer of await values.generator()) {
                    for (const y of outer) {
                        valuesArray.push(y)
                    }
                }

                break
            }
            case ParallelGeneratorType.ArrayOfPromises:
            {
                for (const outer of values.generator()) {
                    for (const y of await outer) {
                        valuesArray.push(y)
                    }
                }

                break
            }
            case ParallelGeneratorType.PromiseOfPromises:
            {
                for (const outer of await values.generator()) {
                    for (const y of await outer) {
                        valuesArray.push(y)
                    }
                }

                break
            }
        }
        return valuesArray
    }

    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export function selectManyAsync<TSource, OUT>(
    source: IParallelEnumerable<TSource>,
    selector: (x: TSource) => Promise<Iterable<OUT>>): IParallelEnumerable<OUT> {
    const generator = async () => {
        const values = await ParallelEnumerablePrivate.nextIterationAsync(source, selector)

        const valuesArray = []
        switch (values.type) {
            case ParallelGeneratorType.PromiseToArray:
            {
                for (const outer of await values.generator()) {
                    for (const y of outer) {
                        valuesArray.push(y)
                    }
                }

                break
            }
            case ParallelGeneratorType.ArrayOfPromises:
            {
                for (const outer of values.generator()) {
                    for (const y of await outer) {
                        valuesArray.push(y)
                    }
                }

                break
            }
            case ParallelGeneratorType.PromiseOfPromises:
            {
                for (const outer of await values.generator()) {
                    for (const y of await outer) {
                        valuesArray.push(y)
                    }
                }

                break
            }
        }
        return valuesArray
    }

    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export function ofType<TSource, TType extends OfType>(
    source: IAsyncParallel<TSource>,
    type: TType): IParallelEnumerable<InferType<TType>> {

    const typeCheck = typeof type === "string" ?
        ((x: TSource) => typeof x === type) as (x: TSource) => x is InferType<TType> :
        ((x: TSource) => x instanceof (type as any)) as (x: TSource) => x is InferType<TType>

    const data = async () =>
        (await source.toArray()).filter(typeCheck)

    return new BasicParallelEnumerable({
        generator: data,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export function orderBy<TSource, TKey>(
    source: IAsyncParallel<TSource>,
    keySelector: (x: TSource) => TKey,
    comparer?: IComparer<TKey>): IOrderedParallelEnumerable<TSource> {
    return OrderedParallelEnumerable.generate(source, keySelector, true, comparer)
}

export function orderByAsync<TSource, TKey>(
    source: IAsyncParallel<TSource>,
    keySelector: (x: TSource) => Promise<TKey>,
    comparer?: IComparer<TKey>): IOrderedParallelEnumerable<TSource> {
    return OrderedParallelEnumerable.generateAsync(source, keySelector, true, comparer)
}

export function orderByDescending<TSource, TKey>(
    source: IAsyncParallel<TSource>,
    keySelector: (x: TSource) => TKey,
    comparer?: IComparer<TKey>): IOrderedParallelEnumerable<TSource> {
    return OrderedParallelEnumerable.generate(source, keySelector, false, comparer)
}

export function orderByDescendingAsync<TSource, TKey>(
    source: IAsyncParallel<TSource>,
    keySelector: (x: TSource) => Promise<TKey>,
    comparer?: IComparer<TKey>): IOrderedParallelEnumerable<TSource> {
    return OrderedParallelEnumerable.generateAsync(source, keySelector, false, comparer)
}

/**
 * Generates a sequence of integral numbers within a specified range.
 * @param start The value of the first integer in the sequence.
 * @param count The number of sequential integers to generate.
 * @throws {ArgumentOutOfRangeException} Start is Less than 0
 */
// tslint:disable-next-line:no-shadowed-variable
export function range(start: number, count: number): IParallelEnumerable<number> {
    if (start < 0) {
        throw new ArgumentOutOfRangeException(`start`)
    }

    function generator() {
        const items = []
        const maxI = start + count
        for (let i = start; i < maxI; i++) {
            items.push(Promise.resolve(i))
        }
        return items
    }

    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.ArrayOfPromises,
    })
}

export function repeat<T>(
    // tslint:disable-next-line:no-shadowed-variable
    element: T, count: number, delay?: number): IParallelEnumerable<T> {
    if (count < 0) {
        throw new ArgumentOutOfRangeException(`count`)
    }
    if (delay) {
        return ParallelEnumerablePrivate.repeat_2(element, count, delay)
    } else {
        return ParallelEnumerablePrivate.repeat_1(element, count)
    }
}

export function reverse<TSource>(
    source: IParallelEnumerable<TSource>): IParallelEnumerable<TSource> {
    const dataFunc = source.dataFunc
    switch (dataFunc.type) {
        case ParallelGeneratorType.ArrayOfPromises: {
            const generator = () => {
                return dataFunc.generator().reverse()
            }
            return new BasicParallelEnumerable({
                generator,
                type: dataFunc.type,
            })
        }
        case ParallelGeneratorType.PromiseOfPromises: {
            const generator: () => Promise<Array<Promise<TSource>>> = async () => {
                const array = await dataFunc.generator()
                return array.reverse()
            }

            return new BasicParallelEnumerable<TSource>({
                generator,
                type: dataFunc.type,
            })
        }
        case ParallelGeneratorType.PromiseToArray: {
            const generator = async () => {
                const array = await dataFunc.generator()
                return array.reverse()
            }
            return new BasicParallelEnumerable({
                generator,
                type: dataFunc.type,
            })
        }
    }
}

export async function sequenceEquals<TSource>(
    // tslint:disable-next-line:no-shadowed-variable
    first: IAsyncParallel<TSource>,
    second: IAsyncParallel<TSource>,
    comparer: IEqualityComparer<TSource> = StrictEqualityComparer): Promise<boolean> {

    const firstArray = await first.toArray()
    const secondArray = await second.toArray()

    if (firstArray.length !== secondArray.length) {
        return false
    }

    for (let i = 0; i < firstArray.length; i++) {
        const firstResult = firstArray[i]
        const secondResult = secondArray[i]

        if (comparer(firstResult, secondResult) === false) {
            return false
        }
    }

    return true
}

export async function sequenceEqualsAsync<TSource>(
    // tslint:disable-next-line:no-shadowed-variable
    first: IAsyncParallel<TSource>,
    second: IAsyncParallel<TSource>,
    comparer: IAsyncEqualityComparer<TSource>): Promise<boolean> {

    const firstArray = await first.toArray()
    const secondArray = await second.toArray()

    if (firstArray.length !== secondArray.length) {
        return false
    }

    for (let i = 0; i < firstArray.length; i++) {
        const firstResult = firstArray[i]
        const secondResult = secondArray[i]

        if (await comparer(firstResult, secondResult) === false) {
            return false
        }
    }

    return true
}

/**
 * @throws {InvalidOperationException} Sequence contains no elements
 * @throws {InvalidOperationException} Sequence contains more than one element
 * @throws {InvalidOperationException} Sequence contains more than one matching element
 * @throws {InvalidOperationException} Sequence contains no matching elements
 */
export async function single<TSource>(
    source: IParallelEnumerable<TSource>,
    predicate?: (x: TSource) => boolean): Promise<TSource> {
    if (predicate) {
        return ParallelEnumerablePrivate.single_2(source, predicate)
    } else {
        return ParallelEnumerablePrivate.single_1(source)
    }
}

/**
 * @throws {InvalidOperationException} Sequence contains more than one matching element
 * @throws {InvalidOperationException} Sequence contains no matching elements
 */
export async function singleAsync<TSource>(
    source: IParallelEnumerable<TSource>,
    predicate: (x: TSource) => Promise<boolean>): Promise<TSource> {
    const results = await ParallelEnumerablePrivate.toArray(source)

    let hasValue = false
    let singleValue: TSource | null = null

    for (const value of results) {
        if (await predicate(value) === true) {
            if (hasValue === true) {
                throw new InvalidOperationException(ErrorString.MoreThanOneMatchingElement)
            } else {
                hasValue = true
                singleValue = value
            }
        }
    }

    if (hasValue === false) {
        throw new InvalidOperationException(ErrorString.NoMatch)
    }

    return singleValue as TSource
}

export function singleOrDefault<TSource>(
    source: IParallelEnumerable<TSource>,
    predicate?: (x: TSource) => boolean): Promise<TSource | null> {
    if (predicate) {
        return ParallelEnumerablePrivate.singleOrDefault_2(source, predicate)
    } else {
        return ParallelEnumerablePrivate.singleOrDefault_1(source)
    }
}

export async function singleOrDefaultAsync<TSource>(
    source: IParallelEnumerable<TSource>,
    predicate: (x: TSource) => Promise<boolean>): Promise<TSource | null> {
    const results = await ParallelEnumerablePrivate.toArray(source)

    let hasValue = false
    let singleValue: TSource | null = null

    for (const value of results) {
        if (await predicate(value) === true) {
            if (hasValue === true) {
                throw new InvalidOperationException(ErrorString.MoreThanOneElement)
            } else {
                hasValue = true
                singleValue = value
            }
        }
    }

    return singleValue
}

export function skip<TSource>(
    source: IParallelEnumerable<TSource>,
    // tslint:disable-next-line:no-shadowed-variable
    count: number): IParallelEnumerable<TSource> {
    const dataFunc = source.dataFunc
    switch (dataFunc.type) {
        case ParallelGeneratorType.PromiseToArray:
        {
            const generator = async () => (await dataFunc.generator()).slice(count)
            return new BasicParallelEnumerable({
                generator,
                type: ParallelGeneratorType.PromiseToArray,
            })
        }
        case ParallelGeneratorType.ArrayOfPromises:
        {
            const generator = () => dataFunc.generator().slice(count)
            return new BasicParallelEnumerable({
                generator,
                type: ParallelGeneratorType.ArrayOfPromises,
            })
        }
        case ParallelGeneratorType.PromiseOfPromises:
        {
            const generator = async () => {
                const dataInner = await dataFunc.generator()
                return dataInner.slice(count)
            }
            const dataFuncNew: TypedData<TSource> = {
                generator,
                type: ParallelGeneratorType.PromiseOfPromises,
            }

            return new BasicParallelEnumerable<TSource>(dataFuncNew)
        }
    }
}

export function skipWhile<TSource>(
    source: IAsyncParallel<TSource>,
    predicate: (x: TSource, index: number) => boolean): IParallelEnumerable<TSource> {
    const generator = async () => {
        const values = await source.toArray()
        let i = 0
        for (; i < values.length; i++) {
            const value = values[i]
            if (predicate(value, i) === false) {
                break
            }
        }

        const returnedValues = []
        for (; i < values.length; i++) {
            returnedValues.push(values[i])
        }
        return returnedValues
    }

    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export function skipWhileAsync<TSource>(
    source: IAsyncParallel<TSource>,
    predicate: (x: TSource, index: number) => Promise<boolean>): IParallelEnumerable<TSource> {
    const generator = async () => {
        const values = await source.toArray()
        let i = 0
        for (; i < values.length; i++) {
            const value = values[i]
            if (await predicate(value, i) === false) {
                break
            }
        }

        const returnedValues = []
        for (; i < values.length; i++) {
            returnedValues.push(values[i])
        }
        return returnedValues
    }

    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export function sum(
    source: IAsyncParallel<number>): Promise<number>
export function sum<TSource>(
    source: IAsyncParallel<TSource>,
    selector: (x: TSource) => number): Promise<number>
export function sum<TSource>(
    source: IAsyncParallel<TSource> | IAsyncParallel<number>,
    selector?: (x: TSource) => number): Promise<number> {

    if (selector) {
        return ParallelEnumerablePrivate.sum_2(source as IAsyncParallel<TSource>, selector)
    } else {
        return ParallelEnumerablePrivate.sum_1(source as IAsyncParallel<number>)
    }
}

export async function sumAsync<TSource>(
    source: IAsyncParallel<TSource>,
    selector: (x: TSource) => Promise<number>): Promise<number> {
    let total = 0
    for (const value of await source.toArray()) {
        total += await selector(value)
    }

    return total
}

export function take<TSource>(
    source: IParallelEnumerable<TSource>,
    amount: number): IParallelEnumerable<TSource> {
    const amountLeft = amount > 0 ? amount : 0
    const dataFunc = source.dataFunc

    switch (dataFunc.type) {
        case ParallelGeneratorType.ArrayOfPromises:
            const generator1 = () => dataFunc.generator().splice(0, amountLeft)
            return new BasicParallelEnumerable<TSource>({
                generator: generator1,
                type: ParallelGeneratorType.ArrayOfPromises,
            })
        case ParallelGeneratorType.PromiseOfPromises:
            const generator2 = () => dataFunc.generator().then((x) => x.splice(0, amountLeft))
            return new BasicParallelEnumerable<TSource>({
                generator: generator2,
                type: ParallelGeneratorType.PromiseOfPromises,
            })
        case ParallelGeneratorType.PromiseToArray:
        default:
            const generator3 = () => dataFunc.generator().then((x) => x.splice(0, amountLeft))
            return new BasicParallelEnumerable<TSource>({
                generator: generator3,
                type: ParallelGeneratorType.PromiseToArray,
            })
    }
}

export function takeWhile<TSource>(
    source: IAsyncParallel<TSource>,
    predicate: (x: TSource, index: number) => boolean): IParallelEnumerable<TSource> {
    const generator = async () => {
        const values = await source.toArray()
        const results = new Array<TSource>()
        if (predicate.length === 1) {
            for (const value of values) {
                if ((predicate as (x: TSource) => boolean)(value) === true) {
                    results.push(value)
                } else {
                    break
                }
            }
        } else {
            for (let i = 0; i < values.length; i++) {
                const value = values[i]
                if (predicate(value, i) === true) {
                    results.push(value)
                } else {
                    break
                }
            }
        }
        return results
    }

    return new BasicParallelEnumerable<TSource>({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export function takeWhileAsync<TSource>(
    source: IAsyncParallel<TSource>,
    predicate: (x: TSource, index: number) => Promise<boolean>): IParallelEnumerable<TSource> {
    const generator = async () => {
        const values = await source.toArray()
        const results = new Array<TSource>()
        if (predicate.length === 1) {
            const sPredicate = predicate as (x: TSource) => Promise<boolean>
            for (const value of values) {
                if (await sPredicate(value) === true) {
                    results.push(value)
                } else {
                    break
                }
            }
        } else {
            for (let i = 0; i < values.length; i++) {
                const value = values[i]
                if (await predicate(value, i) === true) {
                    results.push(value)
                } else {
                    break
                }
            }
        }
        return results
    }

    return new BasicParallelEnumerable<TSource>({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export { toArray } from "./ParallelEnumerablePrivate"

export async function toMap<K, V>(
    source: AsyncIterable<V>,
    selector: (x: V) => K): Promise<Map<K, V[]>> {
    const map = new Map<K, V[]>()

    for await (const value of source) {
        const key = selector(value)
        const array = map.get(key)

        if (array === undefined) {
            map.set(key, [value])
        } else {
            array.push(value)
        }
    }

    return map
}

export async function toMapAsync<K, V>(
    source: AsyncIterable<V>,
    selector: (x: V) => Promise<K>): Promise<Map<K, V[]>> {
    const map = new Map<K, V[]>()

    for await (const value of source) {
        const key = await selector(value)
        const array = map.get(key)

        if (array === undefined) {
            map.set(key, [value])
        } else {
            array.push(value)
        }
    }

    return map
}

export async function toObject<TSource>(
    source: AsyncIterable<TSource>,
    selector: (x: TSource) => string): Promise<{[key: string]: TSource}> {

    const map: {[key: string]: TSource} = {}

    for await (const value of source) {
        map[selector(value)] = value
    }

    return map
}

export async function toSet<TSource>(
    source: AsyncIterable<TSource>): Promise<Set<TSource>> {
    const set = new Set<TSource>()
    for await (const item of source) {
        set.add(item)
    }
    return set
}

export function union<TSource>(
    // tslint:disable-next-line:no-shadowed-variable
    first: IAsyncParallel<TSource>,
    second: IAsyncParallel<TSource>,
    comparer?: IEqualityComparer<TSource>): IParallelEnumerable<TSource> {
    if (comparer) {
        return ParallelEnumerablePrivate.union_2(first, second, comparer)
    } else {
        return ParallelEnumerablePrivate.union_1(first, second)
    }
}

export function unionAsync<TSource>(
    // tslint:disable-next-line:no-shadowed-variable
    first: IAsyncParallel<TSource>,
    second: IAsyncParallel<TSource>,
    comparer: IAsyncEqualityComparer<TSource>): IParallelEnumerable<TSource> {

    const generator = async () => {
        const result: TSource[] = []
        const values = await Promise.all([ first.toArray(), second.toArray() ])

        for (const source of values) {
            for (const value of source) {
                let exists = false

                for (const resultValue of result) {
                    if (await comparer(value, resultValue) === true) {
                        exists = true
                        break
                    }
                }

                if (exists === false) {
                    result.push(value)
                }
            }
        }

        return result
    }

    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export function where<TSource>(
    source: IAsyncParallel<TSource>,
    predicate: (x: TSource) => boolean): IParallelEnumerable<TSource>
export function where<TSource>(
    source: IAsyncParallel<TSource>,
    predicate: (x: TSource, index: number) => boolean): IParallelEnumerable<TSource>
export function where<TSource>(
    source: IAsyncParallel<TSource>,
    predicate: ((x: TSource) => boolean) | ((x: TSource, index: number) => boolean)): IParallelEnumerable<TSource> {
    const generator = async () => {
        const values = await source.toArray()
        return values.filter(predicate)
    }
    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export function whereAsync<T>(
    source: IAsyncParallel<T>,
    predicate: (x: T, index: number) => Promise<boolean>) {
    const generator = async () => {
        const values = await source.toArray()
        const valuesAsync = values.map(async (x, i) => {
            const keep = await predicate(x, i)
            return {
                keep,
                x,
            }
        })
        const filteredValues = []
        for (const value of await Promise.all(valuesAsync)) {
            if (value.keep) {
                filteredValues.push(value.x)
            }
        }
        return filteredValues
    }

    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}

export function zip<T, Y>(
    source: IAsyncParallel<T>,
    second: IAsyncParallel<Y>): IParallelEnumerable<ITuple<T, Y>>
export function zip<T, Y, OUT>(
    source: IAsyncParallel<T>,
    second: IAsyncParallel<Y>,
    resultSelector: (x: T, y: Y) => OUT): IParallelEnumerable<OUT>
export function zip<T, Y, OUT>(
    source: IAsyncParallel<T>,
    second: IAsyncParallel<Y>,
    resultSelector?: (x: T, y: Y) => OUT): IParallelEnumerable<OUT> | IParallelEnumerable<ITuple<T, Y>> {
    if (resultSelector) {
        return ParallelEnumerablePrivate.zip_2(source, second, resultSelector)
    } else {
        return ParallelEnumerablePrivate.zip_1(source, second)
    }
}

export function zipAsync<T, Y, OUT>(
    source: IAsyncParallel<T>,
    second: IAsyncParallel<Y>,
    resultSelector: (x: T, y: Y) => Promise<OUT>): IParallelEnumerable<OUT> {
    async function generator() {
        const [left, right] = await Promise.all([source.toArray(), second.toArray()])
        const maxLength = left.length > right.length ? left.length : right.length
        const resultPromises = new Array<Promise<OUT>>(maxLength)
        for (let i = 0; i < maxLength; i++) {
            const a = left[i]
            const b = right[i]
            resultPromises[i] = resultSelector(a, b)
        }
        return Promise.all(resultPromises)
    }

    return new BasicParallelEnumerable({
        generator,
        type: ParallelGeneratorType.PromiseToArray,
    })
}
