import { ErrorString, InvalidOperationException } from "../../shared/TypesAndHelpers"

export function aggregate<TSource>(
    source: Iterable<TSource>,
    func: (x: TSource, y: TSource) => TSource): TSource
export function aggregate<TSource, TAccumulate>(
    source: Iterable<TSource>,
    seed: TAccumulate,
    func: (x: TAccumulate, y: TSource) => TAccumulate): TAccumulate
export function aggregate<TSource, TAccumulate, TResult>(
    source: Iterable<TSource>,
    seed: TAccumulate,
    func: (x: TAccumulate, y: TSource) => TAccumulate,
    resultSelector: (x: TAccumulate) => TResult): TResult
export function aggregate<TSource, TAccumulate, TResult>(
    source: Iterable<TSource>,
    seedOrFunc: ((x: TSource, y: TSource) => TSource) | TAccumulate,
    func?: (x: TAccumulate, y: TSource) => TAccumulate,
    resultSelector?: (x: TAccumulate) => TResult): TSource | TAccumulate | TResult | null {
    if (resultSelector) {
        if (!func) {
            throw new ReferenceError(`TAccumulate function is undefined`)
        }

        return aggregate_3(source, seedOrFunc as TAccumulate, func, resultSelector)
    } else if (func) {
        return aggregate_2(source, seedOrFunc as TAccumulate, func)
    } else {
        return aggregate_1(source, seedOrFunc as ((x: TSource, y: TSource) => TSource))
    }
}

/**
 * @throws {InvalidOperationException} No Elements
 */
function aggregate_1<TSource>(
    source: Iterable<TSource>,
    func: (x: TSource, y: TSource) => TSource): TSource | null {
    let aggregateValue: TSource | undefined

    for (const value of source) {
        if (aggregateValue) {
            aggregateValue = func(aggregateValue, value)
        } else {
            aggregateValue = value
        }
    }

    if (aggregateValue === undefined) {
        throw new InvalidOperationException(ErrorString.NoElements)
    }

    return aggregateValue
}

function aggregate_2<TSource, TAccumulate>(
    source: Iterable<TSource>,
    seed: TAccumulate,
    func: (x: TAccumulate, y: TSource) => TAccumulate): TAccumulate {
    let aggregateValue = seed

    for (const value of source) {
        aggregateValue = func(aggregateValue, value)
    }

    return aggregateValue
}

function aggregate_3<TSource, TAccumulate, TResult>(
    source: Iterable<TSource>,
    seed: TAccumulate,
    func: (x: TAccumulate, y: TSource) => TAccumulate,
    resultSelector: (x: TAccumulate) => TResult): TResult {
    let aggregateValue = seed

    for (const value of source) {
        aggregateValue = func(aggregateValue, value)
    }

    return resultSelector(aggregateValue)
}