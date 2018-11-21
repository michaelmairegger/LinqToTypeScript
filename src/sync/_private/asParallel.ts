import { from } from "../../parallel/ParallelEnumerable"
import { ParallelGeneratorType } from "../../parallel/ParallelGeneratorType"
import { IParallelEnumerable } from "../../types"

/**
 * Converts an iterable to @see {IAsyncParallel}
 */
export function asParallel<TSource>(source: Iterable<TSource>): IParallelEnumerable<TSource> {
    async function generator() {
        const array = []
        for (const value of source) {
            array.push(value)
        }
        return array
    }

    return from(ParallelGeneratorType.PromiseToArray, generator)
}
