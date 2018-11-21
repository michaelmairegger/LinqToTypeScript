import { ErrorString, InvalidOperationException } from "../../shared/TypesAndHelpers"

/**
 * @throws {InvalidOperationException} No Matching Elements
 */
export async function maxAsync<TSource>(
    source: AsyncIterable<TSource>, selector: (x: TSource) => Promise<number>): Promise<number> {
    let max: number | null = null
    for await (const item of source) {
        max = Math.max(max || Number.NEGATIVE_INFINITY, await selector(item))
    }

    if (max === null) {
        throw new InvalidOperationException(ErrorString.NoElements)
    } else {
        return max
    }
}