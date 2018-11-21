import { ErrorString, InvalidOperationException } from "../../shared/TypesAndHelpers"

/**
 * @throws {InvalidOperationException} There are no elements matching predicate
 */
export async function firstAsync<T>(
    source: AsyncIterable<T>,
    predicate: (x: T) => Promise<boolean>): Promise<T> {
    for await (const value of source) {
        if (await predicate(value) === true) {
            return value
        }
    }

    throw new InvalidOperationException(ErrorString.NoMatch)
}