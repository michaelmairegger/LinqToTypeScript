import { ErrorString, InvalidOperationException } from "../../shared/TypesAndHelpers"

/**
 * @throws {InvalidOperationException} More than one element matchines predicate
 */
export async function singleOrDefaultAsync<TSource>(
    source: Iterable<TSource>,
    predicate: (x: TSource) => Promise<boolean>): Promise<TSource | null> {

    let hasValue = false
    let singleValue: TSource | null = null

    for (const value of source) {
        if (await predicate(value)) {
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