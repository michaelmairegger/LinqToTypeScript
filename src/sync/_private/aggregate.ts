import { ErrorString } from "../../shared/ErrorString"
import { InvalidOperationException } from "../../shared/InvalidOperationException"

/**
 * Applies an accumulator function over a sequence.
 * @param source An IEnumerable<T> to aggregate over.
 * @param func An accumulator function to be invoked on each element.
 */
export function aggregate<TSource>(
    source: Iterable<TSource>,
    func: (x: TSource, y: TSource) => TSource): TSource
/**
 * Applies an accumulator function over a sequence.
 * The specified seed value is used as the initial accumulator value.
 * @param source An IEnumerable<T> to aggregate over.
 * @param seed The initial accumulator value.
 * @param func An accumulator function to be invoked on each element.
 */
export function aggregate<TSource, TAccumulate>(
    source: Iterable<TSource>,
    seed: TAccumulate,
    func: (x: TAccumulate, y: TSource) => TAccumulate): TAccumulate
/**
 * Applies an accumulator function over a sequence.
 * The specified seed value is used as the initial accumulator value,
 * and the specified function is used to select the result value.
 * @param source An IEnumerable<T> to aggregate over.
 * @param seed The initial accumulator value.
 * @param func An accumulator function to be invoked on each element.
 * @param resultSelector A function to transform the final accumulator value into the result value.
 */
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
